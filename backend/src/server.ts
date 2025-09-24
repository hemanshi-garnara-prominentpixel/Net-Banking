import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { syncDatabase } from "./model/associations";
import { userRouter } from "./routes/user.router";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

syncDatabase();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/users", userRouter);
app.use("/", (req: Request, res: Response) => {
  res.status(404).send("Invalid URL");
});

app.listen(port, () => {
  console.log(`your server is running on port ${port}`);
});
