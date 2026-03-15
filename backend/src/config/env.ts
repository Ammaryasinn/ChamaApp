import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  MPESA_CONSUMER_KEY: z.string().default(""),
  MPESA_CONSUMER_SECRET: z.string().default(""),
  MPESA_PASSKEY: z.string().default(""),
  MPESA_SHORTCODE: z.string().default(""),
  MPESA_CALLBACK_URL: z.string().default(""),
  AT_API_KEY: z.string().default(""),
  AT_USERNAME: z.string().default("sandbox"),
  SAFARICOM_CALLBACK_IPS: z.string().default("196.201.214.200/24,196.201.214.206"),
  FRONTEND_URL: z.string().default("http://localhost:8081"),
});

export const env = envSchema.parse(process.env);