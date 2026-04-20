import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        message: "Đăng ký thành công",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.login(username, password);
      res.status(200).json({
        message: "Đăng nhập thành công",
        data: user,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: "Thiếu Refresh Token" });
      }
      const result = await AuthService.refresh(refreshToken);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  }
}
