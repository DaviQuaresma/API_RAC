"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const processarFallback_1 = require("./processarFallback");
// Roda a cada 30 minutos
node_cron_1.default.schedule("*/10 * * * *", async () => {
    console.log("[CRON] Rodando fallback automático...");
    await (0, processarFallback_1.processarFallback)();
});
