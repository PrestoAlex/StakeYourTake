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
const REPUTATION_COUNT_POINTER: u16 = Blockchain.nextPointer;

/**
 * ReputationTracker - ULTRA SIMPLE
 * Only stores: reputation update count
 * User reputation tracked off-chain
 */
@final
export class ReputationTracker extends OP_NET {
  private reputationCount: StoredU256;

  constructor() {
    super();
    this.reputationCount = new StoredU256(REPUTATION_COUNT_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.reputationCount.set(u256.Zero);
  }

  // UPDATE REPUTATION - just increment counter
  @method()
  public updateReputation(_calldata: Calldata): BytesWriter {
    const newCount = u256.add(this.reputationCount.value, u256.One);
    this.reputationCount.set(newCount);

    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(newCount);
    return response; // Return new reputation update ID
  }

  // GET COUNT - read only
  @view()
  @method('getCount')
  public getCount(_calldata: Calldata): BytesWriter {
    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(this.reputationCount.value);
    return response;
  }
}
