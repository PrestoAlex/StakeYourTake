import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the addLike function call.
 */
export type AddLike = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the getCount function call.
 */
export type GetCount = CallResult<{}, OPNetEvent<never>[]>;

// ------------------------------------------------------------------
// ILikeCounter
// ------------------------------------------------------------------
export interface ILikeCounter extends IOP_NETContract {
    addLike(): Promise<AddLike>;
    getCount(): Promise<GetCount>;
}
