import { Request, Response } from "express";
import { UserService } from "../services/user.service";

interface AuthRequest extends Request {
  user: {
    userId: number;
    username: string;
  };
}

export class UserController {
  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user.userId;
      const user = await UserService.getMe(userId);

      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}
