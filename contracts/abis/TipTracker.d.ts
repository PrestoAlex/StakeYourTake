import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the addTip function call.
 */
export type AddTip = CallResult<
    {
        tipId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getCount function call.
 */
export type GetCount = CallResult<
    {
        count: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the onOP20Received function call.
 */
export type OnOP20Received = CallResult<
    {
        retval: number;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// ITipTracker
// ------------------------------------------------------------------
export interface ITipTracker extends IOP_NETContract {
    addTip(tokenAddress: Address, amount: bigint): Promise<AddTip>;
    getCount(): Promise<GetCount>;
    onOP20Received(from: Address, to: Address, amount: bigint, data: Uint8Array): Promise<OnOP20Received>;
}
