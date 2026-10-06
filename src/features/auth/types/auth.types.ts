export type AuthProviderType = "LOCAL" | "GOOGLE";

export type UserRole = "USER" | "ADMIN";

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  nationality: string | null;
  provider: AuthProviderType;
  role: UserRole;
  createdAt: string;
  commentsCount: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthSession {
  user: UserResponse;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthContextValue {
  user: UserResponse | null;
  session: AuthSession | null;
  isLoading: boolean;
  hasSeenWelcome: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  loginWithGoogle: (idToken: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (newUserData: Partial<UserResponse>) => Promise<void>;
  markWelcomeSeen: () => Promise<void>;
}

export type AuthMode = "login" | "register";

export interface PasswordRequirement {
  id: string;
  label: string;
  valid: boolean;
}
