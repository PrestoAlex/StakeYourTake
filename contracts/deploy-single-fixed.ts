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
const priorityFee = BigInt(process.env.PRIORITY_FEE || '0');
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

function normalizeRawTransaction(rawTx: unknown): string {
  if (!rawTx) {
    throw new Error('Raw transaction is empty');
  }

  if (typeof rawTx === 'string') {
    const normalized = rawTx.trim();
    const noPrefix = normalized.startsWith('0x') ? normalized.slice(2) : normalized;

    if (/^[0-9a-fA-F]+$/.test(noPrefix) && noPrefix.length % 2 === 0) {
      return noPrefix;
    }

    if (/^[A-Za-z0-9+/=]+$/.test(normalized)) {
      return Buffer.from(normalized, 'base64').toString('hex');
    }

    throw new Error('Raw transaction string is neither valid hex nor base64');
  }

  if (rawTx instanceof Uint8Array) {
    return Buffer.from(rawTx).toString('hex');
  }

  if (Array.isArray(rawTx)) {
    return Buffer.from(rawTx).toString('hex');
  }

  throw new Error(`Unsupported raw transaction type: ${typeof rawTx}`);
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
  const wallet = new Mnemonic(
    mnemonic,
    '',
    btcNetwork,
    MLDSASecurityLevel.LEVEL2,
  ).deriveOPWallet(AddressTypes.P2TR, 0);

  const provider = new JSONRpcProvider({
    url: rpcUrl,
    network: btcNetwork,
  });

  console.log(`📍 Network: ${networkName}`);
  console.log(`👛 Wallet: ${wallet.p2tr}`);
  console.log(`⚡ Fee Rate: ${feeRate} sat/vB`);

  // Read WASM
  const bytecode = fs.readFileSync(path.resolve(__dirname, wasmPath));
  console.log(`📦 WASM Size: ${bytecode.length} bytes`);

  try {
    const challenge = await provider.getChallenge();
    const utxos = await provider.utxoManager.getUTXOs({
      address: wallet.p2tr,
      optimize: false,
    });

    if (!utxos.length) {
      throw new Error(`No UTXOs found for ${wallet.p2tr}`);
    }

    const balance = utxos.reduce((sum: bigint, utxo: any) => sum + utxo.value, 0n);
    const appliedFeeRate = clampFeeRate(feeRate);

    console.log(`💰 Balance: ${balance} sats`);
    console.log(`⚡ Applied fee rate: ${appliedFeeRate} sat/vB`);

    const factory = new TransactionFactory();
    const deployment = await factory.signDeployment({
      signer: wallet.keypair,
      mldsaSigner: wallet.mldsaKeypair,
      bytecode: new Uint8Array(bytecode),
      network: btcNetwork,
      from: wallet.p2tr,
      utxos,
      feeRate: appliedFeeRate,
      challenge,
      priorityFee,
      gasSatFee,
      calldata: undefined,
      linkMLDSAPublicKeyToAddress: true,
      revealMLDSAPublicKey: true,
    });

    console.log(`🎯 Contract address: ${deployment.contractAddress}`);

    const fundingRawTx = normalizeRawTransaction(deployment.transaction[0]);
    const deployRawTx = normalizeRawTransaction(deployment.transaction[1]);

    console.log(`📤 Sending funding transaction...`);
    const fundingResult = await provider.sendRawTransaction(fundingRawTx, false);
    if (!fundingResult.success) {
      throw new Error(`Funding TX broadcast failed: ${JSON.stringify(fundingResult)}`);
    }

    console.log(`⏳ Waiting for funding confirmation...`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log(`📤 Sending deployment transaction...`);
    const deployResult = await provider.sendRawTransaction(deployRawTx, false);
    if (!deployResult.success) {
      throw new Error(`Deploy TX broadcast failed: ${JSON.stringify(deployResult)}`);
    }

    console.log(`🎉 ${contractName} deployed successfully!`);
    console.log(`📍 Address: ${deployment.contractAddress}`);
    console.log(`🔗 Funding TX: ${fundingResult.txid}`);
    console.log(`🔗 Deploy TX: ${deployResult.txid}`);
    console.log(`🔗 Explorer: https://opscan.org/transactions/${deployResult.txid}`);

    // Save to addresses file
    const addressesFile = './CONTRACT_ADDRESSES.json';
    let addresses: any = {};
    
    if (fs.existsSync(addressesFile)) {
      addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
    }
    
    if (!addresses.contracts) addresses.contracts = {};
    addresses.contracts[contractName] = deployment.contractAddress;
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
