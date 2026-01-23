export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number; // em segundos
  user?: { id: string | number; name?: string };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number; // em segundos
}

export interface AuthState {
  user: LoginResponse["user"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  loading: boolean;
  error: string | null;
}
