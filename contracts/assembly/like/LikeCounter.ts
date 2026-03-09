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
const LIKE_COUNT_POINTER: u16 = Blockchain.nextPointer;

/**
 * LikeCounter - ULTRA SIMPLE
 * Only stores: like count
 * Each like gets sequential ID
 * Prediction ID tracked off-chain
 */
@final
export class LikeCounter extends OP_NET {
  private likeCount: StoredU256;

  constructor() {
    super();
    this.likeCount = new StoredU256(LIKE_COUNT_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.likeCount.set(u256.Zero);
  }

  // ADD LIKE - just increment counter
  @method()
  public addLike(_calldata: Calldata): BytesWriter {
    const newCount = u256.add(this.likeCount.value, u256.One);
    this.likeCount.set(newCount);

    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(newCount);
    return response; // Return new like ID
  }

  // GET COUNT - read only
  @view()
  @method('getCount')
  public getCount(_calldata: Calldata): BytesWriter {
    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(this.likeCount.value);
    return response;
  }
}
