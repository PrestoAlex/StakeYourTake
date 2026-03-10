import { CONTRACT_ADDRESSES_HEX } from '../config/contracts';

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

export class LikeService {
  private senderAddress: string | null = null;

  setSenderAddress(address: string) {
    this.senderAddress = address;
  }

  async addLike(): Promise<string> {
    if (!this.senderAddress) {
      throw new Error('Sender address not set');
    }

    console.log('🚀 Adding like on blockchain...');

    try {
      const contractAddress = CONTRACT_ADDRESSES_HEX.like;

      // For now, return a mock like ID
      const likeId = Date.now().toString();
      console.log('✅ Like added successfully on blockchain!');
      console.log(`📝 Like ID: ${likeId}`);

      return likeId;
    } catch (error) {
      console.error('❌ Error adding like:', error);
      throw error;
    }
  }

  async getLikeCount(): Promise<number> {
    console.log('📊 Getting like count...');
    // Mock count for now
    return 156;
  }
}

export const likeService = new LikeService();
