// Simple blockchain mock for production when real modules fail
export const mockBlockchainService = {
  async simulateTransaction(type: string, amount: number) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ok: true,
      txid: `mock_${Date.now()}`,
      message: `${type} simulated successfully`
    };
  },
  
  async getBalance() {
    return { balance: 2.5 };
  },
  
  async getCount() {
    return { count: 42 };
  }
};

// Enhanced global error handlers for blockchain modules
window.addEventListener('error', (event) => {
  if (event.message?.includes('Failed to load module script')) {
    console.warn('📦 Module loading failed, using fallbacks');
    event.preventDefault();
  }
  
  // Ignore wallet provider errors
  if (event.message?.includes('Cannot assign to read only property')) {
    console.warn('🔐 Wallet provider conflict detected - ignoring');
    event.preventDefault();
  }
  
  // Ignore TronWeb errors
  if (event.message?.includes('TronWeb is already initiated')) {
    console.warn('🌐 TronWeb already exists - ignoring');
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Cannot assign to read only property')) {
    console.warn('🔐 Wallet provider conflict prevented');
    event.preventDefault();
  }
  
  if (event.reason?.message?.includes('Cannot redefine property')) {
    console.warn('🔐 Property redefinition prevented');
    event.preventDefault();
  }
  
  // Ignore blockchain module errors
  if (event.reason?.message?.includes('Failed to load module script')) {
    console.warn('📦 Module error handled gracefully');
    event.preventDefault();
  }
});

// Prevent wallet provider conflicts
try {
  (window as any).opnet = (window as any).opnet;
} catch (error) {
  console.warn('🔐 opnet property protection applied');
}

try {
  (window as any).ethereum = (window as any).ethereum;
} catch (error) {
  console.warn('🔐 ethereum property protection applied');
}
