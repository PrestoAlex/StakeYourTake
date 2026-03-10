import { CONTRACT_ADDRESSES, CONTRACT_ADDRESSES_HEX } from '../config/contracts';
import { Address } from '@btc-vision/transaction';

// ABI для LikeCounter
export const LIKE_COUNTER_ABI = [
  {
    type: 'function',
    name: 'addLike',
    inputs: [],
    outputs: [{ name: 'likeId', type: 'uint256' }]
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

export async function getLikeContract(contractAddress, abi, network, senderAddress?) {
  if (!contractAddress) {
    throw new Error('Like contract address is not configured');
  }

  const { getContract, JSONRpcProvider, ABIDataTypes, BitcoinAbiTypes } = await loadSDK();
  const btcNetwork = await resolveNetwork(network);
  const typedAbi = normalizeAbi(abi || LIKE_COUNTER_ABI, ABIDataTypes, BitcoinAbiTypes);
  
  const provider = new JSONRpcProvider({
    url: RPC_URL,
    network: btcNetwork,
  });

  return getContract(contractAddress, typedAbi, provider, btcNetwork, senderAddress);
}

export async function addLike(contractAddress, senderAddress, network) {
  if (!senderAddress) {
    throw new Error('Wallet address required');
  }

  console.log('🚀 Adding like on blockchain...');

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
    
    const senderAddressObj = Address.fromString(mldsaHashedPublicKey, '02' + tweakedPubkey);
    const contract = await getLikeContract(contractAddress, LIKE_COUNTER_ABI, network, senderAddressObj);

    if (typeof contract.addLike !== 'function') {
      throw new Error('Method addLike not found on contract');
    }

    if (typeof contract.setTransactionDetails === 'function') {
      contract.setTransactionDetails({ inputs: [], outputs: [] });
    }

    const simulation = await contract.addLike();
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
    console.log('✅ Like added:', txid);

    return {
      ok: true,
      txid,
      likeId: Date.now().toString(),
      explorerUrl: `${EXPLORER_BASE}/${txid}?network=${NETWORK_PARAM}`,
    };
  } catch (error) {
    console.error('❌ Error in addLike:', error);

    if (error.message?.includes('signer is not allowed in interaction parameters')) {
      throw new Error('Wallet interaction error: Please check your OP_NET wallet extension and try again.');
    }

    throw error;
  }
}

export async function getLikeCount(contractAddress, network) {
  const contract = await getLikeContract(contractAddress, LIKE_COUNTER_ABI, network);
  
  if (typeof contract.getCount !== 'function') {
    throw new Error('Method getCount not found on contract');
  }

  try {
    const result = await contract.getCount();
    if (result?.revert) {
      throw new Error(`Contract revert: ${result.revert}`);
    }

    let properties = {};
    try {
      properties = result?.properties || {};
    } catch (bufferError) {
      console.warn('Buffer reading error for getCount:', bufferError.message);
      if (result && typeof result === 'object') {
        properties = { raw: result };
      }
    }

    const count = (properties as any)?.count || 0;
    console.log('📊 Current like count:', count);

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

export class LikeService {
  private contractAddress: string;
  private network: string;
  private senderAddress: string | null = null;

  constructor() {
    this.contractAddress = CONTRACT_ADDRESSES.like;
    this.network = 'testnet';
  }

  setSenderAddress(address: string) {
    this.senderAddress = address;
  }

  async addLike(): Promise<string | null> {
    if (!this.senderAddress) {
      console.error('❌ Wallet address required');
      return null;
    }

    try {
      const result = await addLike(this.contractAddress, this.senderAddress, this.network);
      return result.likeId;
    } catch (error) {
      console.error('❌ Failed to add like:', error);
      return null;
    }
  }

  async getLikeCount(): Promise<number> {
    try {
      const result = await getLikeCount(this.contractAddress, this.network);
      return result.count;
    } catch (error) {
      console.error('❌ Failed to get like count:', error);
      return 0;
    }
  }
}

export const likeService = new LikeService();
