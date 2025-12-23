export interface AuthService {
  verifyToken(token: string): Promise<{ userId: string }>;
}
