# StakeYourTake - OP_NET Contracts

## 🎯 Overview
6 simple, reusable contracts for StakeYourTake platform on OP_NET.

## 📄 Contracts

### 1. PredictionStorage
- **Purpose**: Generate sequential prediction IDs
- **Storage**: 1 slot (prediction count)
- **Methods**: `createPrediction()`, `getCount()`

### 2. StakeTracker
- **Purpose**: Track stake transactions
- **Storage**: 1 slot (stake count)
- **Methods**: `addStake()`, `getCount()`

### 3. TipTracker
- **Purpose**: Track tip/gift transactions
- **Storage**: 1 slot (tip count)
- **Methods**: `addTip()`, `getCount()`

### 4. LikeCounter
- **Purpose**: Track likes on predictions
- **Storage**: 1 slot (like count)
- **Methods**: `addLike()`, `getCount()`

### 5. CommentCounter
- **Purpose**: Track comments on predictions
- **Storage**: 1 slot (comment count)
- **Methods**: `addComment()`, `getCount()`

### 6. ReputationTracker
- **Purpose**: Track reputation updates
- **Storage**: 1 slot (reputation count)
- **Methods**: `updateReputation()`, `getCount()`

## 🚀 Deployment

### Setup
```bash
# Copy environment
cp .env.example .env
# Edit .env with your MNEMONIC

# Install dependencies
npm install

# Build all contracts
npm run build:all

# Deploy all contracts
npm run deploy:all
```

### Individual Commands
```bash
npm run build          # PredictionStorage
npm run build:stake    # StakeTracker
npm run build:tip      # TipTracker
npm run build:like     # LikeCounter
npm run build:comment  # CommentCounter
npm run build:reputation # ReputationTracker
```

## 🔧 Architecture

### OP_NET Compliance
- ✅ Minimal storage (1 slot per contract)
- ✅ Simple methods (1-2 operations)
- ✅ No complex u256 operations
- ✅ Reusable (can be called multiple times)

### Off-Chain Data
- Prediction content → IPFS/Arweave
- User data → Database
- Token amounts → Backend API
- Reputation scores → Backend API

### On-Chain Logic
- Sequential ID generation
- Transaction counting
- Simple state updates

## 🎯 Integration

### Frontend
```typescript
// Contract addresses from CONTRACT_ADDRESSES.json
import { CONTRACT_ADDRESSES } from './config';

// Call contracts via OP_NET wallet
const createPrediction = async () => {
  const result = await window.opnet.request({
    method: 'eth_sendTransaction',
    params: [{
      to: CONTRACT_ADDRESSES.prediction,
      data: encodedCreatePredictionCall
    }]
  });
  return result;
};
```

### Backend
```typescript
// Store detailed data off-chain
const prediction = {
  id: onChainId, // From contract
  content: 'Bitcoin will reach $100k',
  author: userAddress,
  amount: '0.1',
  token: 'MOTO',
  timestamp: Date.now()
};
```

## 🔗 Token Integration

### Existing Tokens
- **MOTO**: ERC-20 on OP_NET
- **PIIL**: ERC-20 on OP_NET
- **BTC**: Native Bitcoin

### Token Addresses
Add to `.env`:
```env
MOTO_TOKEN_ADDRESS=0x...
PIIL_TOKEN_ADDRESS=0x...
```

## 📊 Usage Flow

1. **Create Prediction** → Call `createPrediction()` → Get ID
2. **Stake Tokens** → Call `addStake()` → Record transaction
3. **Add Comment** → Call `addComment()` → Get comment ID
4. **Like Prediction** → Call `addLike()` → Record interaction
5. **Send Tip** → Call `addTip()` → Record tip
6. **Update Reputation** → Call `updateReputation()` → Update score

## 🎯 Benefits

- **Gas Efficient**: Minimal storage, simple logic
- **Scalable**: Each contract handles one function
- **Reliable**: OP_NET compatible, no complex operations
- **Reusable**: Can be called unlimited times
- **Maintainable**: Easy to update individual contracts

## 📝 Notes

- All contracts return sequential IDs
- Detailed data stored off-chain
- Token transfers handled separately
- Events can be added for real-time updates

## 🚀 Next Steps

1. Deploy contracts to OP_NET testnet
2. Integrate with frontend wallet
3. Set up backend API for off-chain data
4. Add real-time event listeners
5. Deploy to mainnet after testing
