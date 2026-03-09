import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const ReputationTrackerEvents = [];

export const ReputationTrackerAbi = [
    {
        name: 'updateReputation',
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getCount',
        constant: true,
        inputs: [],
        outputs: [],
        type: BitcoinAbiTypes.Function,
    },
    ...ReputationTrackerEvents,
    ...OP_NET_ABI,
];

export default ReputationTrackerAbi;
