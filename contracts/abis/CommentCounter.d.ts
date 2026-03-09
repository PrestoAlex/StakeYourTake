import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the addComment function call.
 */
export type AddComment = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the getCount function call.
 */
export type GetCount = CallResult<{}, OPNetEvent<never>[]>;

// ------------------------------------------------------------------
// ICommentCounter
// ------------------------------------------------------------------
export interface ICommentCounter extends IOP_NETContract {
    addComment(): Promise<AddComment>;
    getCount(): Promise<GetCount>;
}
