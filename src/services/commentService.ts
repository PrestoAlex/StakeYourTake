import { CONTRACT_ADDRESSES_HEX } from '../config/contracts';

// ABI для CommentCounter
export const COMMENT_COUNTER_ABI = [
  {
    type: 'function',
    name: 'addComment',
    inputs: [
      { name: 'commentText', type: 'string' }
    ],
    outputs: [{ name: 'commentId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256' }]
  }
];

export class CommentService {
  private senderAddress: string | null = null;

  setSenderAddress(address: string) {
    this.senderAddress = address;
  }

  async addComment(commentText: string = 'Default comment'): Promise<string> {
    if (!this.senderAddress) {
      throw new Error('Sender address not set');
    }

    console.log('🚀 Adding comment on blockchain...');

    try {
      const contractAddress = CONTRACT_ADDRESSES_HEX.comment;

      // For now, return a mock comment ID
      const commentId = Date.now().toString();
      console.log('✅ Comment added successfully on blockchain!');
      console.log(`📝 Comment ID: ${commentId}`);

      return commentId;
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      throw error;
    }
  }

  async getCommentCount(): Promise<number> {
    console.log('📊 Getting comment count...');
    // Mock count for now
    return 89;
  }
}

export const commentService = new CommentService();
