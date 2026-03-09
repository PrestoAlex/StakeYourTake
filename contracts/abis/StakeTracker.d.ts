import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the addStake function call.
 */
export type AddStake = CallResult<
    {
        stakeId: bigint;
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
// IStakeTracker
// ------------------------------------------------------------------
export interface IStakeTracker extends IOP_NETContract {
    addStake(tokenAddress: Address, amount: bigint): Promise<AddStake>;
    getCount(): Promise<GetCount>;
    onOP20Received(from: Address, to: Address, amount: bigint, data: Uint8Array): Promise<OnOP20Received>;
}
