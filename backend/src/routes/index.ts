import { Router } from "express";

import { healthRouter } from "./health.routes";
import { authRouter } from "./auth.routes";
import { chamaRouter } from "./chama.routes";
import mpesaRouter from "./mpesa.routes";
import creditScoreRouter from "./credit-score.routes";
import uploadRouter from "./upload.routes";
import { notificationRouter } from "./notification.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/chamas", chamaRouter);
apiRouter.use("/mpesa", mpesaRouter);
apiRouter.use("/credit-scores", creditScoreRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/notifications", notificationRouter);
