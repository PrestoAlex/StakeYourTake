import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the updateReputation function call.
 */
export type UpdateReputation = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the getCount function call.
 */
export type GetCount = CallResult<{}, OPNetEvent<never>[]>;

// ------------------------------------------------------------------
// IReputationTracker
// ------------------------------------------------------------------
export interface IReputationTracker extends IOP_NETContract {
    updateReputation(): Promise<UpdateReputation>;
    getCount(): Promise<GetCount>;
}
