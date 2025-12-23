import type { AuthService } from "../../application/ports/AuthService.js";

export class RemoteAuthService implements AuthService {
  constructor(private readonly baseUrl: string) {}

  async verifyToken(token: string): Promise<{ userId: string }> {
    const response = await fetch(`${this.baseUrl}/auth/verify`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || "unknown_error");
    }

    const data = (await response.json()) as { userId?: string };

    if (!data.userId) {
      throw new Error("invalid_response");
    }

    return { userId: data.userId };
  }
}
