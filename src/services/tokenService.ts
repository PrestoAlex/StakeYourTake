import { TOKEN_ADDRESSES } from '../config/contracts';
import OP20Abi from '../../contracts/abis/OP20.abi';
import { Address } from '@btc-vision/transaction';

export const OP20_ABI = OP20Abi;

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

export async function getTokenContract(tokenSymbol, abi, network, senderAddress?) {
  const tokenAddress = TOKEN_ADDRESSES[tokenSymbol];
  if (!tokenAddress || tokenAddress === 'native') {
    throw new Error(`Token ${tokenSymbol} is not a contract token`);
  }

  const { getContract, JSONRpcProvider, ABIDataTypes, BitcoinAbiTypes } = await loadSDK();
  const btcNetwork = await resolveNetwork(network);
  const typedAbi = normalizeAbi(abi || OP20_ABI, ABIDataTypes, BitcoinAbiTypes);
  
  const provider = new JSONRpcProvider({
    url: RPC_URL,
    network: btcNetwork,
  });

  return getContract(tokenAddress, typedAbi, provider, btcNetwork, senderAddress);
}

export async function getTokenBalance(tokenSymbol, userAddress, network) {
  if (tokenSymbol === 'BTC') {
    // For BTC, we need to get the native balance
    const { JSONRpcProvider } = await loadSDK();
    const btcNetwork = await resolveNetwork(network);
    const provider = new JSONRpcProvider({
      url: RPC_URL,
      network: btcNetwork,
    });

    try {
      const balance = await provider.getBalance(userAddress);
      return {
        ok: true,
        balance: balance.toString(),
        formatted: (Number(balance) / 1e8).toFixed(8),
      };
    } catch (error) {
      console.error('❌ Error getting BTC balance:', error);
      return {
        ok: false,
        balance: '0',
        formatted: '0.00000000',
        error: error.message || String(error),
      };
    }
  }

  try {
    // Create Address object for sender like in stakeService/tipService
    const { JSONRpcProvider } = await loadSDK();
    const btcNetwork = await resolveNetwork(network);
    const provider = new JSONRpcProvider({
      url: RPC_URL,
      network: btcNetwork,
    });

    console.log(`🔍 Getting balance for ${tokenSymbol} at ${userAddress}`);
    
    const senderPublicKeyInfo = await provider.getPublicKeysInfoRaw(userAddress);
    console.log('🔍 Public key info for balance:', senderPublicKeyInfo);
    
    const addressData = senderPublicKeyInfo[userAddress];
    if (!addressData) {
      throw new Error(`No address data found for ${userAddress}`);
    }
    
    const mldsaHashedPublicKey = addressData.mldsaHashedPublicKey;
    const tweakedPubkey = addressData.tweakedPubkey;
    console.log('🔍 Balance check - ML-DSA hashed key:', mldsaHashedPublicKey);
    console.log('🔍 Balance check - Tweaked pubkey:', tweakedPubkey);
    
    // Address.fromString requires BOTH params: hashedMLDSAKey and tweakedPublicKey
    const senderAddressObj = Address.fromString(mldsaHashedPublicKey, '02' + tweakedPubkey);
    console.log('🔍 Balance check - Address object created:', senderAddressObj);
    
    const contract = await getTokenContract(tokenSymbol, OP20_ABI, network, senderAddressObj);
    
    if (typeof contract.balanceOf !== 'function') {
      throw new Error('Method balanceOf not found on token contract');
    }

    const result = await contract.balanceOf(senderAddressObj);
    console.log('🔍 BalanceOf CallResult:', result);
    
    if (result?.revert) {
      throw new Error(`Contract revert: ${result.revert}`);
    }

    // Extract balance from CallResult using base64
    const keys = Object.keys(result);
    const resultBase64Key = keys.find(k => k.includes('resultBase64'));
    const base64Result = resultBase64Key ? (result as any)[resultBase64Key] : undefined;
    console.log('🔍 Balance base64 result:', base64Result);
    console.log('🔍 Available keys:', keys);
    let balance = '0';
    
    if (base64Result && base64Result !== '') {
      // Decode base64 to get bytes
      const decodedBytes = Uint8Array.from(atob(base64Result), c => c.charCodeAt(0));
      console.log('🔍 Balance decoded bytes:', decodedBytes);
      
      // Convert bytes to hex string
      const hexString = Array.from(decodedBytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      console.log('🔍 Balance hex string:', hexString);
      
      // Convert hex to BigInt (little-endian for Bitcoin)
      balance = BigInt('0x' + hexString.match(/../g)?.reverse().join('') || '0').toString();
      console.log('🔍 Balance as BigInt:', balance);
    } else {
      console.log('🔍 Balance is 0 (empty base64)');
    }

    const decimals = 18; // Most OP20 tokens use 18 decimals
    
    return {
      ok: true,
      balance,
      formatted: (Number(balance) / Math.pow(10, decimals)).toFixed(6),
    };
  } catch (error) {
    console.error('❌ Error getting token balance:', error);
    // Return zero balance on error to prevent UI crashes
    return {
      ok: false,
      balance: '0',
      formatted: '0.000000',
      error: error.message || String(error),
    };
  }
}

export async function transferToken(tokenSymbol, toAddress, amount, senderAddress, network) {
  if (tokenSymbol === 'BTC') {
    throw new Error('BTC transfers should be handled through the wallet directly');
  }

  const contract = await getTokenContract(tokenSymbol, OP20_ABI, network);
  
  if (typeof contract.transfer !== 'function') {
    throw new Error('Method transfer not found on token contract');
  }

  console.log(`🚀 Transferring ${amount} ${tokenSymbol} to ${toAddress}...`);

  try {
    const simulation = await contract.transfer(toAddress, amount);
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
    console.log(`✅ ${tokenSymbol} transferred:`, txid);
    
    return {
      ok: true,
      txid,
      explorerUrl: `${EXPLORER_BASE}/${txid}?network=${NETWORK_PARAM}`,
    };
  } catch (error) {
    console.error(`❌ Error transferring ${tokenSymbol}:`, error);
    
    if (error.message?.includes('signer is not allowed in interaction parameters')) {
      throw new Error('Wallet interaction error: Please check your OP_NET wallet extension and try again.');
    }
    
    if (error.message?.includes('insufficient balance')) {
      throw new Error('Insufficient balance for this transfer.');
    }
    
    throw error;
  }
}

export class TokenService {
  private network: string;

  constructor() {
    this.network = 'testnet';
  }

  async getBalance(tokenSymbol, userAddress) {
    return await getTokenBalance(tokenSymbol, userAddress, this.network);
  }

  async transfer(tokenSymbol, toAddress, amount, senderAddress) {
    return await transferToken(tokenSymbol, toAddress, amount, senderAddress, this.network);
  }

  async getAllBalances(userAddress) {
    const balances = {};
    
    for (const tokenSymbol of Object.keys(TOKEN_ADDRESSES)) {
      try {
        const result = await this.getBalance(tokenSymbol, userAddress);
        balances[tokenSymbol] = result.ok ? result.formatted : '0';
      } catch (error) {
        console.error(`❌ Error getting ${tokenSymbol} balance:`, error);
        balances[tokenSymbol] = '0';
      }
    }
    
    return balances;
  }
}

// Singleton instance
export const tokenService = new TokenService();
