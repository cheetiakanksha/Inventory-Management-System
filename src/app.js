import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { apiRateLimiter } from "./middlewares/rateLimiter.js";
import { authRouter } from "./routes/authRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { sendSuccess } from "./utils/response.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

const parsedOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: parsedOrigins.includes("*") ? true : parsedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRateLimiter);

app.get("/api/health", (_req, res) => {
  return sendSuccess(res, 200, "Service is healthy", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

app.get(["/", "/login"], (_req, res) => {
  return res.sendFile(path.join(publicDir, "login.html"));
});

app.get("/register", (_req, res) => {
  return res.sendFile(path.join(publicDir, "register.html"));
});

app.get("/dashboard", (_req, res) => {
  return res.sendFile(path.join(publicDir, "dashboard.html"));
});

app.get(/^\/(?!api).*/, (_req, res) => {
  return res.sendFile(path.join(publicDir, "login.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);
