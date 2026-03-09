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
const COUNT_POINTER: u16 = Blockchain.nextPointer;

/**
 * PredictionStorage - ULTRA SIMPLE
 * Only stores: prediction count
 * Content stored off-chain (IPFS/arweave)
 * Each prediction gets sequential ID
 */
@final
export class PredictionStorage extends OP_NET {
  private predictionCount: StoredU256;

  constructor() {
    super();
    this.predictionCount = new StoredU256(COUNT_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.predictionCount.set(u256.Zero);
  }

  // CREATE NEW PREDICTION - just increment counter
  @method()
  public createPrediction(_calldata: Calldata): BytesWriter {
    const newCount = u256.add(this.predictionCount.value, u256.One);
    this.predictionCount.set(newCount);

    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(newCount);
    return response; // Return new prediction ID
  }

  // GET COUNT - read only
  @view()
  @method('getCount')
  public getCount(_calldata: Calldata): BytesWriter {
    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(this.predictionCount.value);
    return response;
  }
}
