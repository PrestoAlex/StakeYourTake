import { u256 } from '@btc-vision/as-bignum/assembly';
import {
  Address,
  Blockchain,
  BytesWriter,
  Calldata,
  EMPTY_POINTER,
  OP_NET,
  Revert,
  StoredU256,
  TransferHelper,
  U32_BYTE_LENGTH,
  U256_BYTE_LENGTH,
} from '@btc-vision/btc-runtime/runtime';

declare function method(...args: any[]): any;
declare function returns(...args: any[]): any;
declare function view(...args: any[]): any;
declare const ABIDataTypes: any;

const TIP_COUNT_POINTER = Blockchain.nextPointer;
const ON_OP20_RECEIVED_SELECTOR = 0xd83e7dbc;

/**
 * TipTracker with real OP20 deposits.
 * Receives approved tokens and locks them on the contract balance.
 */
export class TipTracker extends OP_NET {
  private tipCount: StoredU256;

  constructor() {
    super();
    this.tipCount = new StoredU256(TIP_COUNT_POINTER, EMPTY_POINTER);
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    this.tipCount.set(u256.Zero);
  }

  @method(
    {
      name: 'tokenAddress',
      type: ABIDataTypes.ADDRESS,
    },
    {
      name: 'amount',
      type: ABIDataTypes.UINT256,
    },
  )
  @returns({ name: 'tipId', type: ABIDataTypes.UINT256 })
  public addTip(_calldata: Calldata): BytesWriter {
    const tokenAddress: Address = _calldata.readAddress();
    const amount = _calldata.readU256();

    if (amount <= u256.Zero) {
      throw new Revert('Tip amount must be greater than zero.');
    }

    TransferHelper.safeTransferFrom(tokenAddress, Blockchain.tx.sender, this.address, amount);

    const newCount = u256.add(this.tipCount.value, u256.One);
    this.tipCount.set(newCount);

    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(newCount);
    return response;
  }

  @view()
  @method('getCount')
  @returns({ name: 'count', type: ABIDataTypes.UINT256 })
  public getCount(_calldata: Calldata): BytesWriter {
    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(this.tipCount.value);
    return response;
  }

  @method(
    {
      name: 'from',
      type: ABIDataTypes.ADDRESS,
    },
    {
      name: 'to',
      type: ABIDataTypes.ADDRESS,
    },
    {
      name: 'amount',
      type: ABIDataTypes.UINT256,
    },
    {
      name: 'data',
      type: ABIDataTypes.BYTES,
    },
  )
  @returns({ name: 'retval', type: ABIDataTypes.UINT32 })
  public onOP20Received(_calldata: Calldata): BytesWriter {
    const response = new BytesWriter(U32_BYTE_LENGTH);
    response.writeU32(ON_OP20_RECEIVED_SELECTOR);
    return response;
  }
}
