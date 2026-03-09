import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const StakeTrackerEvents = [];

export const StakeTrackerAbi = [
    {
        name: 'addStake',
        inputs: [
            { name: 'tokenAddress', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'stakeId', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getCount',
        constant: true,
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'onOP20Received',
        inputs: [
            { name: 'from', type: ABIDataTypes.ADDRESS },
            { name: 'to', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
            { name: 'data', type: ABIDataTypes.BYTES },
        ],
        outputs: [{ name: 'retval', type: ABIDataTypes.UINT32 }],
        type: BitcoinAbiTypes.Function,
    },
    ...StakeTrackerEvents,
    ...OP_NET_ABI,
];

export default StakeTrackerAbi;
