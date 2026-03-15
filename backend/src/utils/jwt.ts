import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  phoneNumber: string;
}

export function generateAccessToken(payload: JwtPayload): string {
  const signOptions: SignOptions = {
    expiresIn: "7d",
    algorithm: "HS256",
  };
  return jwt.sign(payload, env.JWT_SECRET as string, signOptions);
}

export function generateRefreshToken(payload: JwtPayload): string {
  const signOptions: SignOptions = {
    expiresIn: "30d",
    algorithm: "HS256",
  };
  return jwt.sign(payload, env.JWT_SECRET as string, signOptions);
}

export function verifyToken(token: string): JwtPayload {
  const verifyOptions: VerifyOptions = {
    algorithms: ["HS256"],
  };
  return jwt.verify(token, env.JWT_SECRET as string, verifyOptions) as JwtPayload;
}
