import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn"),
  username: z.string().min(3, "Username phải từ 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  email: z.string().email("Email không đúng định dạng"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  gender: z.number().int(),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()),
  facebookLink: z.string().url().optional().or(z.literal("")),
  province: z.string(),
  school: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const refreshTokenSchema = z.object({
  userId: z
    .number()
    .int("User ID phải là số nguyên")
    .positive("User ID không hợp lệ"),
  refreshToken: z.string().min(1, "Refresh Token không được để trống"),
});
