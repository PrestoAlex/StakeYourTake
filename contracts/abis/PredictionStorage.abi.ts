import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const PredictionStorageEvents = [];

export const PredictionStorageAbi = [
    {
        name: 'createPrediction',
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
    ...PredictionStorageEvents,
    ...OP_NET_ABI,
];

export default PredictionStorageAbi;
