import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres.skcbelnlziouifuhbkmv:Top1yasuo20k1@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false },
});

export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Đã kết nối database thành công");
    client.release();
  } catch (err: any) {
    console.error("❌ Lỗi kết nối database", err.message);
  }
};
