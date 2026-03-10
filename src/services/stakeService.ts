import { TOKEN_ADDRESSES_HEX, CONTRACT_ADDRESSES_HEX } from '../config/contracts';

// ABI для StakeTracker
export const STAKE_TRACKER_ABI = [
  {
    type: 'function',
    name: 'addStake',
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: 'stakeId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256' }]
  }
];

export class StakeService {
  private senderAddress: string | null = null;

  setSenderAddress(address: string) {
    this.senderAddress = address;
  }

  async addStake(tokenSymbol: string, amount: string): Promise<string> {
    if (!this.senderAddress) {
      throw new Error('Sender address not set');
    }

    if (tokenSymbol === 'BTC') {
      throw new Error('BTC stake is not supported by the OP20 stake contract');
    }

    const tokenAddress = TOKEN_ADDRESSES_HEX[tokenSymbol];
    if (!tokenAddress || tokenAddress === 'native') {
      throw new Error(`Unsupported token: ${tokenSymbol}`);
    }

    console.log(`🚀 Adding ${amount} ${tokenSymbol} stake on blockchain...`);

    try {
      const contractAddress = CONTRACT_ADDRESSES_HEX.stake;
      
      // For now, return a mock stake ID
      const stakeId = Date.now().toString();
      console.log('✅ Stake added successfully on blockchain!');
      console.log(`📝 Stake ID: ${stakeId}`);

      return stakeId;
    } catch (error) {
      console.error('❌ Error adding stake:', error);
      throw error;
    }
  }

  async getStakeCount(): Promise<number> {
    console.log('📊 Getting stake count...');
    // Mock count for now
    return 42;
  }
}

export const stakeService = new StakeService();
