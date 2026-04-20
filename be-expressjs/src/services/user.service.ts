import { User } from "../entities/user.entity";
import { pool } from "../utils/db";

export class UserService {
  static async getMe(userId: number) {
    const query = `SELECT * FROM users WHERE id = $1`;

    const result = await pool.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const { password, refresh_token, ...userData } = user;

    return userData as User;
  }
}
