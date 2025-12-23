import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "../../../application/ports/AuthService.js";

declare module "express" {
  interface Request {
    userId?: string;
  }
}

export function requireAuth(authService: AuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ error: "missing_token" });
    }

    try {
      const { userId } = await authService.verifyToken(token);
      req.userId = userId;
      return next();
    } catch (error) {
      console.log(error);

      return res.status(401).json({ error: "invalid_token" });
    }
  };
}
