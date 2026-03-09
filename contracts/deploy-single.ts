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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const contractName = process.argv[2];
if (!contractName) {
  console.error('Usage: npm run deploy:single <contract-name>');
  console.error('Available contracts: prediction, stake, tip, like, comment, reputation');
  process.exit(1);
}

const contractFiles: Record<string, string> = {
  prediction: '../build/PredictionStorage.wasm',
  stake: '../build/StakeTracker.wasm',
  tip: '../build/TipTracker.wasm',
  like: '../build/LikeCounter.wasm',
  comment: '../build/CommentCounter.wasm',
  reputation: '../build/ReputationTracker.wasm'
};

const wasmPath = contractFiles[contractName];
if (!wasmPath) {
  console.error(`Unknown contract: ${contractName}`);
  console.error('Available contracts: prediction, stake, tip, like, comment, reputation');
  process.exit(1);
}

const rpcUrl = process.env.RPC_URL || 'https://testnet.opnet.org';
const networkName = process.env.NETWORK || 'testnet';
const feeRate = Number(process.env.FEE_RATE || 5);
const gasSatFee = BigInt(process.env.GAS_SAT_FEE || '500000');

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

async function deployContract(): Promise<void> {
  console.log(`🚀 Deploying ${contractName}...`);
  
  if (!fs.existsSync(wasmPath)) {
    console.error(`❌ WASM file not found: ${wasmPath}`);
    console.error('Run "npm run build:all" first');
    process.exit(1);
  }

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) {
    console.error('❌ MNEMONIC is required in .env file');
    console.error('Create .env file with your MNEMONIC');
    process.exit(1);
  }

  const btcNetwork = networkByName[networkName] || networks.opnetTestnet;
  const provider = new JSONRpcProvider({ url: rpcUrl });
  const wallet = new Mnemonic(mnemonic, MLDSASecurityLevel.Medium).derive(0);

  console.log(`📍 Network: ${networkName}`);
  console.log(`👛 Wallet: ${wallet.address}`);
  console.log(`⚡ Fee Rate: ${feeRate} sat/vB`);

  // Read WASM
  const wasmBuffer = fs.readFileSync(wasmPath);
  console.log(`📦 WASM Size: ${wasmBuffer.length} bytes`);

  try {
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
    console.log(`🔗 Explorer: https://opscan.org/transactions/${txid}`);

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
      console.error(`❌ Transaction not confirmed after ${maxAttempts} attempts`);
      process.exit(1);
    }

    // Extract contract address
    const contractAddress = receipt.contractAddress || txid;
    console.log(`🎉 ${contractName} deployed successfully!`);
    console.log(`📍 Address: ${contractAddress}`);

    // Save to addresses file
    const addressesFile = './CONTRACT_ADDRESSES.json';
    let addresses: any = {};
    
    if (fs.existsSync(addressesFile)) {
      addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
    }
    
    if (!addresses.contracts) addresses.contracts = {};
    addresses.contracts[contractName] = contractAddress;
    addresses.network = networkName;
    addresses.deployedAt = new Date().toISOString();

    fs.writeFileSync(addressesFile, JSON.stringify(addresses, null, 2));
    console.log(`💾 Address saved to ${addressesFile}`);

  } catch (error) {
    console.error(`❌ Deployment failed:`, error);
    process.exit(1);
  }
}

deployContract().catch(console.error);
