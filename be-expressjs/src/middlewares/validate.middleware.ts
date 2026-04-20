import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodObject } from "zod";

export const validate =
  (schema: ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({ message: "Lỗi hệ thống khi validate" });
    }
  };
