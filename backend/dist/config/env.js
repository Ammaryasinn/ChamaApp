"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: zod_1.z.string().min(16, "JWT_SECRET must be at least 16 characters"),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("7d"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("30d"),
    MPESA_CONSUMER_KEY: zod_1.z.string().default(""),
    MPESA_CONSUMER_SECRET: zod_1.z.string().default(""),
    MPESA_PASSKEY: zod_1.z.string().default(""),
    MPESA_SHORTCODE: zod_1.z.string().default(""),
    MPESA_CALLBACK_URL: zod_1.z.string().default(""),
    AT_API_KEY: zod_1.z.string().default(""),
    AT_USERNAME: zod_1.z.string().default("sandbox"),
    SAFARICOM_CALLBACK_IPS: zod_1.z.string().default("196.201.214.200/24,196.201.214.206"),
    FRONTEND_URL: zod_1.z.string().default("http://localhost:8081"),
});
exports.env = envSchema.parse(process.env);
