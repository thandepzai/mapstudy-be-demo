import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDbConnection } from "./utils/db";
import rootRoutes from "./routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use("", rootRoutes);

app.get("/", (req, res) => {
  res.send("Server 3000 đã sẵn sàng!");
});

app.listen(PORT, async () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  await testDbConnection();
});
