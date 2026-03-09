import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the createPrediction function call.
 */
export type CreatePrediction = CallResult<{}, OPNetEvent<never>[]>;

/**
 * @description Represents the result of the getCount function call.
 */
export type GetCount = CallResult<{}, OPNetEvent<never>[]>;

// ------------------------------------------------------------------
// IPredictionStorage
// ------------------------------------------------------------------
export interface IPredictionStorage extends IOP_NETContract {
    createPrediction(): Promise<CreatePrediction>;
    getCount(): Promise<GetCount>;
}
