import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const CommentCounterEvents = [];

export const CommentCounterAbi = [
    {
        name: 'addComment',
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
    ...CommentCounterEvents,
    ...OP_NET_ABI,
];

export default CommentCounterAbi;
