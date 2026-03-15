"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.chamaRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const chamaService = __importStar(require("../services/chama.service"));
const memberService = __importStar(require("../services/member.service"));
const auth_1 = require("../middleware/auth");
const error_1 = require("../middleware/error");
const cycle_routes_1 = require("./cycle.routes");
const mgr_routes_1 = require("./mgr.routes");
const loan_routes_1 = require("./loan.routes");
exports.chamaRouter = (0, express_1.Router)();
exports.chamaRouter.use("/:id/cycles", cycle_routes_1.cycleRouter);
exports.chamaRouter.use("/:id/mgr", mgr_routes_1.mgrRouter);
exports.chamaRouter.use("/:id/loans", loan_routes_1.loanRouter);
// Create chama (protected)
exports.chamaRouter.post("/", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        chamaType: zod_1.z.enum(["merry_go_round", "investment", "welfare", "hybrid"]),
        contributionAmount: zod_1.z.number().positive(),
        contributionFrequency: zod_1.z.enum(["weekly", "biweekly", "monthly"]),
        meetingDay: zod_1.z.number().optional(),
        penaltyAmount: zod_1.z.number().nonnegative().optional(),
        penaltyGraceDays: zod_1.z.number().nonnegative().optional(),
        maxLoanMultiplier: zod_1.z.number().positive().optional(),
        loanInterestRate: zod_1.z.number().nonnegative().optional(),
        minVotesToApproveLoan: zod_1.z.number().nonnegative().optional(),
        mgrPercentage: zod_1.z.number().nonnegative().optional(),
        investmentPercentage: zod_1.z.number().nonnegative().optional(),
        welfarePercentage: zod_1.z.number().nonnegative().optional(),
    });
    const data = schema.parse(req.body);
    const chama = await chamaService.createChama(req.user.userId, data);
    res.status(201).json(chama);
}));
// List user's chamas (protected)
exports.chamaRouter.get("/", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const chamas = await chamaService.getUserChamas(req.user.userId);
    res.status(200).json(chamas);
}));
// Get single chama (protected)
exports.chamaRouter.get("/:id", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const chama = await chamaService.getChamaById(req.params.id);
    res.status(200).json(chama);
}));
// Update chama (protected, chairperson only)
exports.chamaRouter.put("/:id", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        contributionAmount: zod_1.z.number().positive().optional(),
        contributionFrequency: zod_1.z.enum(["weekly", "biweekly", "monthly"]).optional(),
        meetingDay: zod_1.z.number().optional(),
        penaltyAmount: zod_1.z.number().nonnegative().optional(),
        penaltyGraceDays: zod_1.z.number().nonnegative().optional(),
        loanInterestRate: zod_1.z.number().nonnegative().optional(),
        minVotesToApproveLoan: zod_1.z.number().nonnegative().optional(),
    });
    const data = schema.parse(req.body);
    const chama = await chamaService.updateChama(req.params.id, req.user.userId, data);
    res.status(200).json(chama);
}));
// Add member (protected, chairperson only)
exports.chamaRouter.post("/:id/members", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        phoneNumber: zod_1.z.string().min(1),
        role: zod_1.z.enum(["chairperson", "treasurer", "secretary", "member"]).optional(),
    });
    const { phoneNumber, role } = schema.parse(req.body);
    const member = await memberService.addChamaMember(req.params.id, req.user.userId, phoneNumber, role || "member");
    res.status(201).json(member);
}));
// List members (protected)
exports.chamaRouter.get("/:id/members", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const members = await memberService.getChamaMembers(req.params.id);
    res.status(200).json(members);
}));
// Get member profile (protected)
exports.chamaRouter.get("/:id/members/:memberId", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const profile = await memberService.getChamaMemberProfile(req.params.id, req.params.memberId, req.user.userId);
    res.status(200).json(profile);
}));
// Update member role (protected, chairperson only)
exports.chamaRouter.put("/:id/members/:memberId", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        role: zod_1.z.enum(["chairperson", "treasurer", "secretary", "member"]),
    });
    const { role } = schema.parse(req.body);
    const member = await memberService.updateMemberRole(req.params.id, req.params.memberId, req.user.userId, role);
    res.status(200).json(member);
}));
// Remove member (protected, chairperson only)
exports.chamaRouter.delete("/:id/members/:memberId", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const result = await memberService.removeChamaMember(req.params.id, req.params.memberId, req.user.userId);
    res.status(200).json(result);
}));
