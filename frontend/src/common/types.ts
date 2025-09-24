export interface LoginData {
  username: string;
  password: string;
}

export interface IAuthContext {
  authenticated: boolean;
  loading: boolean;
  userData: { id: number; name: string; email: string } | null;
  refreshAuth: () => void;
}
