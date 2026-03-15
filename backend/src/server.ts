import { createServer } from "http";

import { Server } from "socket.io";

import { app } from "./app";
import { env } from "./config/env";
import { initCronJobs } from "./cron";

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join:chama", (chamaId: string) => {
    if (typeof chamaId === "string" && chamaId.length > 0) {
      socket.join(`chama:${chamaId}`);
    }
  });
});

initCronJobs();

httpServer.listen(env.PORT, () => {
  console.log(`Hazina API listening on http://localhost:${env.PORT}`);
});
