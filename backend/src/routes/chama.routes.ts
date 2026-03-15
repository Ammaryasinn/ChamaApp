import { Router, Request, Response } from "express";
import { z } from "zod";
import * as chamaService from "../services/chama.service";
import * as memberService from "../services/member.service";
import { authMiddleware } from "../middleware/auth";
import { asyncHandler } from "../middleware/error";
import { ChamaType, ContributionFrequency } from "@prisma/client";
import { cycleRouter } from "./cycle.routes";
import { mgrRouter } from "./mgr.routes";
import { loanRouter } from "./loan.routes";

export const chamaRouter = Router();

chamaRouter.use("/:id/cycles", cycleRouter);
chamaRouter.use("/:id/mgr", mgrRouter);
chamaRouter.use("/:id/loans", loanRouter);


// Create chama (protected)
chamaRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      chamaType: z.enum(["merry_go_round", "investment", "welfare", "hybrid"]),
      contributionAmount: z.number().positive(),
      contributionFrequency: z.enum(["weekly", "biweekly", "monthly"]),
      meetingDay: z.number().optional(),
      penaltyAmount: z.number().nonnegative().optional(),
      penaltyGraceDays: z.number().nonnegative().optional(),
      maxLoanMultiplier: z.number().positive().optional(),
      loanInterestRate: z.number().nonnegative().optional(),
      minVotesToApproveLoan: z.number().nonnegative().optional(),
      mgrPercentage: z.number().nonnegative().optional(),
      investmentPercentage: z.number().nonnegative().optional(),
      welfarePercentage: z.number().nonnegative().optional(),
    });

    const data = schema.parse(req.body);
    const chama = await chamaService.createChama(req.user!.userId, data);

    res.status(201).json(chama);
  }),
);

// List user's chamas (protected)
chamaRouter.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const chamas = await chamaService.getUserChamas(req.user!.userId);
    res.status(200).json(chamas);
  }),
);

// Get single chama (protected)
chamaRouter.get(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const chama = await chamaService.getChamaById(req.params.id as string);
    res.status(200).json(chama);
  }),
);

// Update chama (protected, chairperson only)
chamaRouter.put(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      contributionAmount: z.number().positive().optional(),
      contributionFrequency: z.enum(["weekly", "biweekly", "monthly"]).optional(),
      meetingDay: z.number().optional(),
      penaltyAmount: z.number().nonnegative().optional(),
      penaltyGraceDays: z.number().nonnegative().optional(),
      loanInterestRate: z.number().nonnegative().optional(),
      minVotesToApproveLoan: z.number().nonnegative().optional(),
    });

    const data = schema.parse(req.body);
    const chama = await chamaService.updateChama(
      req.params.id as string,
      req.user!.userId,
      data,
    );

    res.status(200).json(chama);
  }),
);

// Add member (protected, chairperson only)
chamaRouter.post(
  "/:id/members",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      phoneNumber: z.string().min(1),
      role: z.enum(["chairperson", "treasurer", "secretary", "member"]).optional(),
    });

    const { phoneNumber, role } = schema.parse(req.body);
    const member = await memberService.addChamaMember(
      req.params.id as string,
      req.user!.userId,
      phoneNumber,
      role || "member",
    );

    res.status(201).json(member);
  }),
);

// List members (protected)
chamaRouter.get(
  "/:id/members",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const members = await memberService.getChamaMembers(req.params.id as string);
    res.status(200).json(members);
  }),
);

// Get member profile (protected)
chamaRouter.get(
  "/:id/members/:memberId",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await memberService.getChamaMemberProfile(
      req.params.id as string,
      req.params.memberId as string,
      req.user!.userId,
    );

    res.status(200).json(profile);
  }),
);

// Update member role (protected, chairperson only)
chamaRouter.put(
  "/:id/members/:memberId",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      role: z.enum(["chairperson", "treasurer", "secretary", "member"]),
    });

    const { role } = schema.parse(req.body);
    const member = await memberService.updateMemberRole(
      req.params.id as string,
      req.params.memberId as string,
      req.user!.userId,
      role,
    );

    res.status(200).json(member);
  }),
);

// Remove member (protected, chairperson only)
chamaRouter.delete(
  "/:id/members/:memberId",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await memberService.removeChamaMember(
      req.params.id as string,
      req.params.memberId as string,
      req.user!.userId,
    );

    res.status(200).json(result);
  }),
);
