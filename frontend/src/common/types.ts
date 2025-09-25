export interface LoginData {
  username: string;
  password: string;
}

export interface IAuthContext {
  authenticated: boolean;
  loading: boolean;
  userData: {
    id: number;
    username: string;
    email: string;
    account_number: string;
    balance: number;
  } | null;
  refreshAuth: () => void;
}

export interface TransactionData {
  amount: number;
  remark: string;
}

export interface TransferData {
  account_number: string;
  amount: number;
  remark: string;
}
