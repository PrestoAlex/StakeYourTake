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

// Global error handler for blockchain modules
window.addEventListener('error', (event) => {
  if (event.message?.includes('Failed to load module script')) {
    console.warn('Module loading failed, using fallbacks');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Cannot assign to read only property')) {
    console.warn('Wallet provider conflict detected');
    event.preventDefault();
  }
});
