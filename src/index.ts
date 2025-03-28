import express, { Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT} 🚀🚀🚀`);
});
