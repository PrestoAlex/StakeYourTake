import { u256 } from '@btc-vision/as-bignum/assembly';
import {
  Blockchain,
  BytesWriter,
  Calldata,
  OP_NET,
  StoredU256,
  EMPTY_POINTER,
  U256_BYTE_LENGTH,
} from '@btc-vision/btc-runtime/runtime';

declare function method(...args: any[]): any;
declare function returns(...args: any[]): any;
declare function view(...args: any[]): any;
declare const ABIDataTypes: any;

// Storage pointers - MINIMAL! Only 1 slot
const COMMENT_COUNT_POINTER: u16 = Blockchain.nextPointer;

/**
 * CommentCounter - ULTRA SIMPLE
 * Only stores: comment count
 * Each comment gets sequential ID
 * Comment content stored off-chain
 */
@final
export class CommentCounter extends OP_NET {
  private commentCount: StoredU256;

  constructor() {
    super();
    this.commentCount = new StoredU256(COMMENT_COUNT_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.commentCount.set(u256.Zero);
  }

  // ADD COMMENT - just increment counter
  @method()
  public addComment(_calldata: Calldata): BytesWriter {
    const newCount = u256.add(this.commentCount.value, u256.One);
    this.commentCount.set(newCount);

    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(newCount);
    return response; // Return new comment ID
  }

  // GET COUNT - read only
  @view()
  @method('getCount')
  public getCount(_calldata: Calldata): BytesWriter {
    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(this.commentCount.value);
    return response;
  }
}
