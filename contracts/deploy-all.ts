import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { JSONRpcProvider } from 'opnet';
import {
  AddressTypes,
  MLDSASecurityLevel,
  Mnemonic,
  TransactionFactory,
} from '@btc-vision/transaction';
import { networks } from '@btc-vision/bitcoin';

/**
 * StakeYourTake - Multi-Contract Deployment Script
 * 
 * Deploys all 6 simple contracts:
 * 1. PredictionStorage
 * 2. StakeTracker  
 * 3. TipTracker
 * 4. LikeCounter
 * 5. CommentCounter
 * 6. ReputationTracker
 * 
 * Each contract is reusable - can be called multiple times
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const rpcUrl = process.env.RPC_URL || 'https://testnet.opnet.org';
const networkName = process.env.NETWORK || 'testnet';
const feeRate = Number(process.env.FEE_RATE || 5);
const priorityFee = BigInt(process.env.PRIORITY_FEE || '0');
const gasSatFee = BigInt(process.env.GAS_SAT_FEE || '500000');

const contractFiles = {
  prediction: './build/PredictionStorage.wasm',
  stake: './build/StakeTracker.wasm',
  tip: './build/TipTracker.wasm',
  like: './build/LikeCounter.wasm',
  comment: './build/CommentCounter.wasm',
  reputation: './build/ReputationTracker.wasm'
};

const networkByName: Record<string, any> = {
  mainnet: networks.bitcoin,
  bitcoin: networks.bitcoin,
  testnet: networks.opnetTestnet,
  regtest: networks.regtest,
};

function clampFeeRate(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(888, Math.floor(value)));
}

async function deployContract(wasmPath: string, contractName: string): Promise<string> {
  console.log(`\n🚀 Deploying ${contractName}...`);
  
  if (!fs.existsSync(wasmPath)) {
    throw new Error(`WASM file not found: ${wasmPath}. Run 'npm run build:all' first.`);
  }

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) throw new Error('MNEMONIC is required in .env');

  const btcNetwork = networkByName[networkName] || networks.opnetTestnet;
  const provider = new JSONRpcProvider(rpcUrl);
  const wallet = new Mnemonic(mnemonic, MLDSASecurityLevel.Medium).deriveKey(0);

  console.log(`📍 Network: ${networkName}`);
  console.log(`👛 Wallet: ${wallet.address}`);
  console.log(`⚡ Fee Rate: ${feeRate} sat/vB`);

  // Read WASM
  const wasmBuffer = fs.readFileSync(wasmPath);
  console.log(`📦 WASM Size: ${wasmBuffer.length} bytes`);

  // Build transaction
  const tx = await TransactionFactory.build({
    network: btcNetwork,
    from: wallet.address,
    feeRate: clampFeeRate(feeRate),
    payload: wasmBuffer,
    gasSatFee: gasSatFee,
    addressType: AddressTypes.P2WPKH,
  });

  // Sign transaction
  const signedTx = wallet.signTransaction(tx);
  console.log(`✍️  Transaction signed`);

  // Send transaction
  const txid = await provider.sendRawTransaction(signedTx.hex);
  console.log(`📤 Transaction sent: ${txid}`);

  // Wait for confirmation
  console.log(`⏳ Waiting for confirmation...`);
  let receipt = null;
  let attempts = 0;
  const maxAttempts = 30;

  while (!receipt && attempts < maxAttempts) {
    try {
      receipt = await provider.getTransactionReceipt(txid);
      if (receipt) break;
    } catch (error) {
      // Transaction might not be indexed yet
    }
    
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`⏳ Checking... Attempt ${attempts}/${maxAttempts}`);
  }

  if (!receipt) {
    throw new Error(`Transaction not confirmed after ${maxAttempts} attempts`);
  }

  // Extract contract address from receipt
  const contractAddress = receipt.contractAddress || txid;
  console.log(`🎉 ${contractName} deployed!`);
  console.log(`📍 Address: ${contractAddress}`);
  console.log(`🔗 Explorer: https://opscan.org/transactions/${txid}`);

  return contractAddress;
}

async function main(): Promise<void> {
  console.log('🎯 StakeYourTake - Multi-Contract Deployment');
  console.log('===========================================');

  const deployedAddresses: Record<string, string> = {};

  try {
    // Deploy all contracts
    for (const [name, wasmPath] of Object.entries(contractFiles)) {
      const address = await deployContract(wasmPath, name.charAt(0).toUpperCase() + name.slice(1));
      deployedAddresses[name] = address;
      
      // Small delay between deployments
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Save addresses to file
    const addressesOutput = {
      network: networkName,
      deployedAt: new Date().toISOString(),
      contracts: deployedAddresses
    };

    fs.writeFileSync('./CONTRACT_ADDRESSES.json', JSON.stringify(addressesOutput, null, 2));
    console.log('\n💾 Contract addresses saved to CONTRACT_ADDRESSES.json');

    // Display summary
    console.log('\n📊 Deployment Summary:');
    console.log('=========================');
    for (const [name, address] of Object.entries(deployedAddresses)) {
      console.log(`${name.padEnd(12)}: ${address}`);
    }

    console.log('\n✅ All contracts deployed successfully!');
    console.log('🎯 Ready for frontend integration!');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
main().catch(console.error);
