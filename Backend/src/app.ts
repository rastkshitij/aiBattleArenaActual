import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import config from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import { invokeAI } from "./controllers/ai.controller.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

app.get("/", async (_req, res) => {
  res.status(200).json({ message: "AI Battle Arena API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/ai", aiRoutes);
app.post("/invoke", requireAuth, invokeAI);

export default app;