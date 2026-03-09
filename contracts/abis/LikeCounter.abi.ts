import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const LikeCounterEvents = [];

export const LikeCounterAbi = [
    {
        name: 'addLike',
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
    ...LikeCounterEvents,
    ...OP_NET_ABI,
];

export default LikeCounterAbi;
