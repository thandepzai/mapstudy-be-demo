import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth"; // Hàm bạn đã viết ở util

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token) as { userId: number; username: string };

    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};