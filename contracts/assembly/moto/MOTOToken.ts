import { u256 } from '@btc-vision/as-bignum/assembly';
import {
  Blockchain,
  BytesWriter,
  Calldata,
  OP20,
  StoredU256,
  EMPTY_POINTER,
  U256_BYTE_LENGTH,
} from '@btc-vision/btc-runtime/runtime';

declare function method(...args: any[]): any;
declare function returns(...args: any[]): any;
declare function view(...args: any[]): any;
declare const ABIDataTypes: any;

/**
 * MOTO Token - OP20 Standard Token
 * Symbol: MOTO
 * Name: Moto Token
 * Decimals: 18
 */
@final
export class MOTOToken extends OP20 {
  constructor() {
    super(
      "Moto Token",
      "MOTO",
      18
    );
  }

  public override onDeployment(_calldata: Calldata): void {
    super.onDeployment(_calldata);
    
    // Mint initial supply to deployer
    const initialSupply = u256.from(1000000 * 10**18); // 1M tokens
    this.mint(_calldata.sender, initialSupply);
  }

  // Additional token methods can be added here
  @method()
  public burn(_calldata: Calldata): BytesWriter {
    const amount = _calldata.readU256(0);
    this.burn(_calldata.sender, amount);
    
    const response = new BytesWriter(U256_BYTE_LENGTH);
    response.writeU256(amount);
    return response;
  }
}
