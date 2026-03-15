import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/error";

export const app = express();

// General rate limit: 200 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
    code: "RATE_LIMIT",
  },
});

// Strict limit for auth endpoints: 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many auth attempts, please try again later.",
    code: "RATE_LIMIT",
  },
});

app.use(generalLimiter);

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:8082",
  "http://localhost:4001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8082",
  "http://127.0.0.1:4001",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(null, false);
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    name: "Hazina API",
    description: "Financial infrastructure for Kenyan chamas.",
  });
});

app.use("/api/auth/request-otp", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);
app.use("/api", apiRouter);

// Error handler must be last
app.use(errorHandler);
