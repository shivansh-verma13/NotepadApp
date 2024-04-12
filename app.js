import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

config();
const app = express();

app.use(cors({ origin: "https://nottepaddapp.netlify.app", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/notepad", router);

export default app;
