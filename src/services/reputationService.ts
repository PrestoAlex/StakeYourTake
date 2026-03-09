import { CONTRACT_ADDRESSES } from '../config/contracts';

// ABI для ReputationTracker
export const REPUTATION_TRACKER_ABI = [
  {
    type: 'function',
    name: 'updateReputation',
    inputs: [],
    outputs: [{ name: 'reputationId', type: 'uint256' }]
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
    sdkPromise = import(/* @vite-ignore */ 'https://esm.sh/opnet@1.8.1-rc.17');
  }
  return sdkPromise;
}

async function loadBitcoin() {
  if (!bitcoinPromise) {
    bitcoinPromise = import(/* @vite-ignore */ 'https://esm.sh/@btc-vision/bitcoin@7.0.0-rc.6');
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

export async function getReputationContract(contractAddress, abi, network) {
  if (!contractAddress) {
    throw new Error('Reputation contract address is not configured');
  }

  const { getContract, JSONRpcProvider, ABIDataTypes, BitcoinAbiTypes } = await loadSDK();
  const btcNetwork = await resolveNetwork(network);
  const typedAbi = normalizeAbi(abi || REPUTATION_TRACKER_ABI, ABIDataTypes, BitcoinAbiTypes);
  
  const provider = new JSONRpcProvider({
    url: RPC_URL,
    network: btcNetwork,
  });

  return getContract(contractAddress, typedAbi, provider, btcNetwork);
}

export async function updateReputation(contractAddress, senderAddress, network) {
  if (!senderAddress) {
    throw new Error('Wallet address required');
  }

  const contract = await getReputationContract(contractAddress, REPUTATION_TRACKER_ABI, network);
  
  if (typeof contract.updateReputation !== 'function') {
    throw new Error('Method updateReputation not found on contract');
  }

  console.log('🚀 Updating reputation...');

  try {
    const simulation = await contract.updateReputation();
    if (simulation?.revert) {
      throw new Error(`Contract revert: ${simulation.revert}`);
    }

    const btcNetwork = await resolveNetwork(network);
    const receipt = await simulation.sendTransaction({
      refundTo: senderAddress,
      feeRate: 1,
      maximumAllowedSatToSpend: 30000n,
      network: btcNetwork,
    });

    const txid = receipt?.transactionId || receipt?.txid || String(receipt);
    console.log('✅ Reputation updated:', txid);
    
    return {
      ok: true,
      txid,
      reputationId: Date.now().toString(), // Timestamp як ID
      explorerUrl: `${EXPLORER_BASE}/${txid}?network=${NETWORK_PARAM}`,
    };
  } catch (error) {
    console.error('❌ Error in updateReputation:', error);
    
    // Handle specific OP_NET wallet errors
    if (error.message?.includes('signer is not allowed in interaction parameters')) {
      throw new Error('Wallet interaction error: Please check your OP_NET wallet extension and try again.');
    }
    
    if (error.message?.includes('out of memory')) {
      throw new Error('Contract memory error: The contract may be too complex. Try simplifying the operation.');
    }
    
    throw error;
  }
}

export async function getReputationCount(contractAddress, network) {
  const contract = await getReputationContract(contractAddress, REPUTATION_TRACKER_ABI, network);
  
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
    console.log('📊 Current reputation count:', count);

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

export class ReputationService {
  private contractAddress: string;
  private network: string;
  private senderAddress: string | null = null;

  constructor() {
    this.contractAddress = CONTRACT_ADDRESSES.reputation;
    this.network = 'testnet';
  }

  setSenderAddress(address: string) {
    this.senderAddress = address;
  }

  async updateReputation(): Promise<string | null> {
    if (!this.senderAddress) {
      console.error('❌ Wallet address required');
      return null;
    }

    try {
      const result = await updateReputation(this.contractAddress, this.senderAddress, this.network);
      return result.reputationId;
    } catch (error) {
      console.error('❌ Failed to update reputation:', error);
      return null;
    }
  }

  async getReputationCount(): Promise<number> {
    try {
      const result = await getReputationCount(this.contractAddress, this.network);
      return result.count;
    } catch (error) {
      console.error('❌ Failed to get reputation count:', error);
      return 0;
    }
  }
}

// Singleton instance
export const reputationService = new ReputationService();
