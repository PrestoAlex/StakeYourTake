declare global {
  interface Window {
    opnet?: OPNetProvider;
  }
}

interface OPNetProvider {
  request?: (params: { method: string; params?: any[] }) => Promise<any>;
  request_accounts?: () => Promise<string[]>;
  requestAccounts?: () => Promise<string[]>;
  get_accounts?: () => Promise<string[]>;
  getAccounts?: () => Promise<string[]>;
  get_balance?: () => Promise<any>;
  getBalance?: () => Promise<any>;
  disconnect?: () => Promise<void>;
}

export {};
