import cron from "node-cron";
import { processarFallback } from "./processarFallback";

// Roda a cada 30 minutos
cron.schedule("*/10 * * * *", async () => {
  console.log("[CRON] Rodando fallback automático...");
  await processarFallback();
});
