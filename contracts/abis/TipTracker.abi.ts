import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const TipTrackerEvents = [];

export const TipTrackerAbi = [
    {
        name: 'addTip',
        inputs: [
            { name: 'tokenAddress', type: ABIDataTypes.ADDRESS },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'tipId', type: ABIDataTypes.UINT256 }],
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
    ...TipTrackerEvents,
    ...OP_NET_ABI,
];

export default TipTrackerAbi;
