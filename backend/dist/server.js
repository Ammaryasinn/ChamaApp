"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = require("./app");
const env_1 = require("./config/env");
const cron_1 = require("./cron");
const httpServer = (0, http_1.createServer)(app_1.app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: env_1.env.FRONTEND_URL,
        credentials: true,
    },
});
exports.io.on("connection", (socket) => {
    socket.on("join:chama", (chamaId) => {
        if (typeof chamaId === "string" && chamaId.length > 0) {
            socket.join(`chama:${chamaId}`);
        }
    });
});
(0, cron_1.initCronJobs)();
httpServer.listen(env_1.env.PORT, () => {
    console.log(`Hazina API listening on http://localhost:${env_1.env.PORT}`);
});
