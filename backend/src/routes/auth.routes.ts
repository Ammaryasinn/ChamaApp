import { Router, Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import { authMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/error";

export const authRouter = Router();

// Request OTP
authRouter.post(
  "/request-otp",
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      phoneNumber: z.string().min(1, "Phone number is required"),
    });

    const { phoneNumber } = schema.parse(req.body);
    const result = await authService.requestOtp(phoneNumber);

    res.status(200).json({
      message: "OTP sent successfully",
      // code: result.code (Available in dev payload, but let's hide here to be safe)
      ...(process.env.NODE_ENV !== 'production' ? { code: result.code } : {})
    });
  }),
);

// Verify OTP
authRouter.post(
  "/verify-otp",
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      phoneNumber: z.string().min(1),
      code: z.string().length(6),
    });

    const { phoneNumber, code } = schema.parse(req.body);
    const result = await authService.verifyOtp(phoneNumber, code);

    res.status(200).json(result);
  }),
);

// Refresh token
authRouter.post(
  "/refresh-token",
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      refreshToken: z.string().min(1),
    });

    const { refreshToken } = schema.parse(req.body);

    // Verify refresh token and extract payload
    const { verifyToken } = await import("../utils/jwt");
    const payload = verifyToken(refreshToken);

    const result = await authService.refreshAccessToken(
      payload.userId,
      payload.phoneNumber,
    );

    res.status(200).json(result);
  }),
);

// Get current user (protected)
authRouter.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getCurrentUser(req.user!.userId);
    res.status(200).json(user);
  }),
);

// Update profile (protected)
authRouter.put(
  "/profile",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      fullName: z.string().optional(),
      nationalId: z.string().optional(),
      profilePhotoUrl: z.string().url().optional(),
    });

    const data = schema.parse(req.body);
    const user = await authService.updateUserProfile(req.user!.userId, data);

    res.status(200).json(user);
  }),
);
