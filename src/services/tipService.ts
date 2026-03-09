import { CONTRACT_ADDRESSES, CONTRACT_ADDRESSES_HEX, TOKEN_ADDRESSES, TOKEN_ADDRESSES_HEX } from '../config/contracts';
import { getTokenContract, OP20_ABI } from './tokenService';
import { Address } from '@btc-vision/transaction';

// ABI для TipTracker
export const TIP_TRACKER_ABI = [
  {
    type: 'function',
    name: 'addTip',
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: 'tipId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256' }]
  }
];

const RPC_URL = 'https://testnet.opnet.org';
const EXPLORER_BASE = 'https://opscan.org/transactions';
const NETWORK_PARAM = 'op_testnet';

function extractPublicKeyHex(payload: unknown, address?: string): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      try {
        return extractPublicKeyHex(item, address);
      } catch {
      }
    }
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;

    if (address && address in record) {
      return extractPublicKeyHex(record[address], undefined);
    }

    const candidateKeys = ['publicKey', 'pubKey', 'key', 'hex', 'raw', 'publicKeys'];
    for (const key of candidateKeys) {
      if (key in record) {
        try {
          return extractPublicKeyHex(record[key], undefined);
        } catch {
        }
      }
    }

    for (const value of Object.values(record)) {
      try {
        return extractPublicKeyHex(value, undefined);
      } catch {
      }
    }
  }

  throw new Error('Unable to extract public key from provider response');
}

function normalizeAbiType(type, ABIDataTypes) {
  if (typeof type !== 'string') return type;

  const key = type.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(ABIDataTypes, key)) {
    return ABIDataTypes[key];
  }

  throw new Error(`Unknown ABI type: ${type}`);
}

function normalizeAbi(abi, ABIDataTypes, BitcoinAbiTypes) {
  return abi.map((entry) => ({
    ...entry,
    type:
      typeof entry.type === 'string' && entry.type.toLowerCase() === 'function'
        ? BitcoinAbiTypes.Function
        : entry.type,
    inputs: (entry.inputs || []).map((input) => ({
      ...input,
      type: normalizeAbiType(input.type, ABIDataTypes),
    })),
    outputs: (entry.outputs || []).map((output) => ({
      ...output,
      type: normalizeAbiType(output.type, ABIDataTypes),
    })),
  }));
}

let sdkPromise = null;
let bitcoinPromise = null;

async function loadSDK() {
  if (!sdkPromise) {
    sdkPromise = import('opnet');
  }
  return sdkPromise;
}

async function loadBitcoin() {
  if (!bitcoinPromise) {
    bitcoinPromise = import('@btc-vision/bitcoin');
  }
  return bitcoinPromise;
}

async function resolveNetwork(networkOverride) {
  if (networkOverride && typeof networkOverride === 'object') {
    return networkOverride;
  }

  const { networks } = await loadBitcoin();

  if (networkOverride === 'mainnet' || networkOverride === 'bitcoin') {
    return networks.bitcoin;
  }

  return networks.opnetTestnet;
}

export async function getTipContract(contractAddress, abi, network, senderAddress?) {
  if (!contractAddress) {
    throw new Error('Tip contract address is not configured');
  }

  const { getContract, JSONRpcProvider, ABIDataTypes, BitcoinAbiTypes } = await loadSDK();
  const btcNetwork = await resolveNetwork(network);
  const typedAbi = normalizeAbi(abi || TIP_TRACKER_ABI, ABIDataTypes, BitcoinAbiTypes);
  
  const provider = new JSONRpcProvider({
    url: RPC_URL,
    network: btcNetwork,
  });

  return getContract(contractAddress, typedAbi, provider, btcNetwork, senderAddress);
}

export async function addTip(contractAddress, senderAddress, network, tokenSymbol, amount) {
  if (!senderAddress) {
    throw new Error('Wallet address required');
  }

  if (tokenSymbol === 'BTC') {
    throw new Error('BTC tips are not supported by the OP20 tip contract');
  }

  const tokenAddress = TOKEN_ADDRESSES_HEX[tokenSymbol];
  if (!tokenAddress || tokenAddress === 'native') {
    throw new Error(`Unsupported token: ${tokenSymbol}`);
  }

  console.log('🚀 Approving tokens for tip...');

  try {
    const btcNetwork = await resolveNetwork(network);
    const { JSONRpcProvider } = await loadSDK();
    const provider = new JSONRpcProvider({
      url: RPC_URL,
      network: btcNetwork,
    });

    const senderPublicKeyInfo = await provider.getPublicKeysInfoRaw(senderAddress);
    console.log('🔍 Sender public key info:', senderPublicKeyInfo);
    
    const addressData = senderPublicKeyInfo[senderAddress];
    const mldsaHashedPublicKey = addressData.mldsaHashedPublicKey;
    const tweakedPubkey = addressData.tweakedPubkey;
    
    // Address.fromString requires BOTH params: hashedMLDSAKey and tweakedPublicKey
    const senderAddressObj = Address.fromString(mldsaHashedPublicKey, '02' + tweakedPubkey);
    const contract = await getTipContract(contractAddress, TIP_TRACKER_ABI, network, senderAddressObj);
    const tokenContract = await getTokenContract(tokenSymbol, OP20_ABI, network, senderAddressObj);

    if (typeof contract.addTip !== 'function') {
      throw new Error('Method addTip not found on contract');
    }

    if (typeof tokenContract.increaseAllowance !== 'function') {
      throw new Error('Method increaseAllowance not found on token contract');
    }

    const contractAddressObj = Address.fromString(CONTRACT_ADDRESSES_HEX.tip);
    const tokenAddressObj = Address.fromString(TOKEN_ADDRESSES_HEX[tokenSymbol]);
    const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e18));
    console.log('🔍 Amount as BigInt:', amountBigInt);

    if (typeof tokenContract.setTransactionDetails === 'function') {
      tokenContract.setTransactionDetails({ inputs: [], outputs: [] });
    }

    const approveSimulation = await tokenContract.increaseAllowance(contractAddressObj, amountBigInt);
    if (approveSimulation?.revert) {
      throw new Error(`Approve revert: ${approveSimulation.revert}`);
    }

    const approveReceipt = await approveSimulation.sendTransaction({
      refundTo: senderAddress,
      feeRate: 1,
      maximumAllowedSatToSpend: 30000n,
      network: btcNetwork,
    });
    
    console.log('🔍 Approve transaction receipt:', approveReceipt);
    console.log('✅ Tokens approved successfully');

    console.log('🚀 Sending real token tip...');

    if (typeof contract.setTransactionDetails === 'function') {
      contract.setTransactionDetails({ inputs: [], outputs: [] });
    }

    const simulation = await contract.addTip(tokenAddressObj, amountBigInt);
    if (simulation?.revert) {
      throw new Error(`Contract revert: ${simulation.revert}`);
    }

    const receipt = await simulation.sendTransaction({
      refundTo: senderAddress,
      feeRate: 1,
      maximumAllowedSatToSpend: 30000n,
      network: btcNetwork,
    });

    const txid = receipt?.transactionId || receipt?.txid || String(receipt);
    console.log('✅ Tip added:', txid);

    return {
      ok: true,
      txid,
      tipId: Date.now().toString(),
      explorerUrl: `${EXPLORER_BASE}/${txid}?network=${NETWORK_PARAM}`,
    };
  } catch (error) {
    console.error('❌ Error in addTip:', error);

    if (error.message?.includes('signer is not allowed in interaction parameters')) {
      throw new Error('Wallet interaction error: Please check your OP_NET wallet extension and try again.');
    }

    if (error.message?.includes('insufficient allowance')) {
      throw new Error('Insufficient token allowance for tip contract.');
    }

    if (error.message?.includes('insufficient balance')) {
      throw new Error('Insufficient token balance for tip.');
    }

    throw error;
  }
}

export async function getTipCount(contractAddress, network) {
  const contract = await getTipContract(contractAddress, TIP_TRACKER_ABI, network);
  
  if (typeof contract.getCount !== 'function') {
    throw new Error('Method getCount not found on contract');
  }

  try {
    const result = await contract.getCount();
    if (result?.revert) {
      throw new Error(`Contract revert: ${result.revert}`);
    }

    // Handle buffer reading errors gracefully
    let properties = {};
    try {
      properties = result?.properties || {};
    } catch (bufferError) {
      console.warn('Buffer reading error for getCount:', bufferError.message);
      if (result && typeof result === 'object') {
        properties = { raw: result };
      }
    }

    const count = properties?.count || 0;
    console.log('📊 Current tip count:', count);

    return {
      ok: true,
      count,
      properties,
    };
  } catch (error) {
    console.error('❌ Error in getCount:', error);
    return {
      ok: false,
      error: error.message || String(error),
      count: 0,
      properties: {},
    };
  }
}

export class TipService {
  private contractAddress: string;
  private network: string;
  private senderAddress: string | null = null;

  constructor() {
    this.contractAddress = CONTRACT_ADDRESSES.tip;
    this.network = 'testnet';
  }

  setSenderAddress(address: string) {
    this.senderAddress = address;
  }

  async addTip(tokenSymbol: string, amount: number): Promise<string | null> {
    if (!this.senderAddress) {
      console.error('❌ Wallet address required');
      return null;
    }

    if (isNaN(amount) || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return null;
    }

    try {
      const result = await addTip(this.contractAddress, this.senderAddress, this.network, tokenSymbol, amount.toString());
      return result.tipId;
    } catch (error) {
      console.error('❌ Failed to add tip:', error);
      return null;
    }
  }

  async getTipCount(): Promise<number> {
    try {
      const result = await getTipCount(this.contractAddress, this.network);
      return result.count;
    } catch (error) {
      console.error('❌ Failed to get tip count:', error);
      return 0;
    }
  }
}

// Singleton instance
export const tipService = new TipService();
