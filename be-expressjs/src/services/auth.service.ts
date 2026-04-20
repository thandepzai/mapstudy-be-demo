import { pool } from "../utils/db";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/auth";
import { User } from "../entities/user.entity";

export class AuthService {
  static async register(userData: User) {
    const {
      fullName,
      username,
      password,
      email,
      phone,
      gender,
      birthYear,
      facebookLink,
      province,
      school,
    } = userData;

    const checkUser = await pool.query(
      "SELECT username, email, phone FROM users WHERE username = $1 OR email = $2 OR phone = $3",
      [username, email, phone],
    );

    if (checkUser.rows.length > 0) {
      const existingUser = checkUser.rows[0];

      if (existingUser.username === username) {
        throw new Error("Tên đăng nhập đã tồn tại");
      }
      if (existingUser.email === email) {
        throw new Error("Email đã được sử dụng");
      }
      if (existingUser.phone === phone) {
        throw new Error("Số điện thoại đã được đăng ký");
      }
    }

    const hashedPassword = await hashPassword(password);

    const query = `
      INSERT INTO users (
        "fullName", "username", "password", "email", "phone", 
        "gender", "birthYear", "facebookLink", "province", "school"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING * 
    `;
    const values = [
      fullName,
      username,
      hashedPassword,
      email,
      phone,
      gender,
      birthYear,
      facebookLink,
      province,
      school,
    ];

    const result = await pool.query(query, values);

    const { password: _, ...userWithoutPassword } = result.rows[0];

    return { ...userWithoutPassword } as User;
  }

  static async login(username: string, password: string) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) throw new Error("Tài khoản không tồn tại");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Mật khẩu không chính xác");

    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username,
    });

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    const { password: _, refresh_token, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      accessToken,
      refreshToken,
    } as User & { accessToken: string; refreshToken: string };
  }

  static async refresh(refreshToken: string) {
    const decoded = verifyToken(refreshToken) as {
      userId: number;
      username: string;
    };

    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1 AND refresh_token = $2",
      [decoded.userId, refreshToken],
    );
    const user = result.rows[0];

    if (!user) throw new Error("Refresh Token không hợp lệ");

    const newAccessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username,
    });

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      newRefreshToken,
      user.id,
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
