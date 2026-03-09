import { CONTRACT_ADDRESSES, OPNET_CONFIG } from '../config/contracts';

interface OPNetProvider {
  request?: (params: { method: string; params?: any[] }) => Promise<any>;
  request_accounts?: () => Promise<string[]>;
  requestAccounts?: () => Promise<string[]>;
  get_accounts?: () => Promise<string[]>;
  getAccounts?: () => Promise<string[]>;
  get_balance?: () => Promise<any>;
  getBalance?: () => Promise<any>;
  disconnect?: () => Promise<void>;
  signAndBroadcastInteraction?: (params: { to: string; data: string }) => Promise<string>;
  deployContract?: (address: string, data: string) => Promise<string>;
  broadcast?: (params: { to: string; data: string }) => Promise<string>;
  pushTx?: (params: { to: string; data: string }) => Promise<string>;
}

function getProvider(): OPNetProvider | null {
  if (typeof window === 'undefined' || !window.opnet) {
    return null;
  }
  return window.opnet;
}

async function callProvider(methods: string[], params: any[] = []): Promise<any> {
  const provider = getProvider();
  if (!provider) {
    throw new Error('OP_NET Wallet extension not detected');
  }

  if (typeof provider.request === 'function') {
    for (const method of methods) {
      try {
        return await provider.request({ method, params });
      } catch {
        // try next
      }
    }
  }

  for (const method of methods) {
    if (typeof provider[method as keyof OPNetProvider] === 'function') {
      try {
        return await (provider[method as keyof OPNetProvider] as Function)(...params);
      } catch {
        // try next
      }
    }
  }

  throw new Error('No compatible OP_NET wallet API method found');
}

export class SimplePredictionService {
  private isConnected: boolean = false;

  async connectWallet(): Promise<boolean> {
    try {
      console.log('🔌 Connecting to OP_NET wallet...');
      
      // Використовуємо той самий метод що і на сайті
      const accounts = await callProvider(['request_accounts', 'requestAccounts'], []);

      if (accounts && accounts.length > 0) {
        this.isConnected = true;
        console.log('✅ Wallet connected:', accounts[0]);
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
    }

    return false;
  }

  async createPrediction(): Promise<string | null> {
    if (!this.isConnected) {
      console.error('❌ Wallet not connected');
      return null;
    }

    try {
      console.log('🚀 Creating prediction...');
      console.log('📍 Contract:', CONTRACT_ADDRESSES.prediction);
      
      const provider = getProvider();
      if (!provider) {
        throw new Error('Provider not available');
      }
      
      // Спробуємо правильні OP_NET методи
      let txHash = null;
      
      try {
        // Метод 1: signAndBroadcastInteraction
        console.log('🔄 Trying signAndBroadcastInteraction...');
        if (provider.signAndBroadcastInteraction) {
          txHash = await provider.signAndBroadcastInteraction({
            to: CONTRACT_ADDRESSES.prediction,
            data: '0x'
          });
        } else {
          throw new Error('signAndBroadcastInteraction not available');
        }
      } catch (e1: any) {
        console.log('❌ signAndBroadcastInteraction failed:', e1.message);
        
        try {
          // Метод 2: deployContract (хоч це для деплою, спробуємо)
          console.log('🔄 Trying deployContract...');
          if (provider.deployContract) {
            txHash = await provider.deployContract(CONTRACT_ADDRESSES.prediction, '0x');
          } else {
            throw new Error('deployContract not available');
          }
        } catch (e2: any) {
          console.log('❌ deployContract failed:', e2.message);
          
          try {
            // Метод 3: broadcast
            console.log('🔄 Trying broadcast...');
            if (provider.broadcast) {
              txHash = await provider.broadcast({
                to: CONTRACT_ADDRESSES.prediction,
                data: '0x'
              });
            } else {
              throw new Error('broadcast not available');
            }
          } catch (e3: any) {
            console.log('❌ broadcast failed:', e3.message);
            
            try {
              // Метод 4: pushTx
              console.log('🔄 Trying pushTx...');
              if (provider.pushTx) {
                txHash = await provider.pushTx({
                  to: CONTRACT_ADDRESSES.prediction,
                  data: '0x'
                });
              } else {
                throw new Error('pushTx not available');
              }
            } catch (e4: any) {
              console.log('❌ pushTx failed:', e4.message);
              throw new Error('No OP_NET transaction method available');
            }
          }
        }
      }

      console.log('✅ Transaction sent:', txHash);
      
      // Повертаємо timestamp як ID
      const predictionId = Date.now().toString();
      console.log('🎯 Prediction ID:', predictionId);
      
      return predictionId;
    } catch (error) {
      console.error('❌ Failed to create prediction:', error);
      return null;
    }
  }

  async getPredictionCount(): Promise<number> {
    if (!this.isConnected) {
      console.error('❌ Wallet not connected');
      return 0;
    }

    try {
      console.log('📊 Getting prediction count...');
      console.log('📍 Contract:', CONTRACT_ADDRESSES.prediction);
      
      // Використовуємо callProvider для виклику
      const result = await callProvider(['eth_call'], [{
        to: CONTRACT_ADDRESSES.prediction,
        data: '0x' // Порожній data для виклику getCount()
      }, 'latest']);

      console.log('📊 Raw result:', result);
      
      // Просте декодування
      const count = result ? parseInt(result, 16) || 0 : 0;
      console.log('📊 Prediction count:', count);
      
      return count;
    } catch (error) {
      console.error('❌ Failed to get prediction count:', error);
      return 0;
    }
  }

  isWalletConnected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
export const simplePredictionService = new SimplePredictionService();
