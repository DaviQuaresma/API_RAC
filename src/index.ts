import express from "express";
import dotenv from "dotenv";
import produtosRoutes from "./routes/produtosRoutes";
import validacaoRoutes from "./routes/validacaoRoutes";
import vendaRoutes from "./routes/vendaRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import fallbackRoutes from "./routes/fallbackRoutes";
import "./jobs/fallbackScheduler";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", produtosRoutes);
app.use("/api", validacaoRoutes);
app.use("/api", vendaRoutes);
app.use("/api", tokenRoutes);
app.use("/api", fallbackRoutes);

app.get("/health", (_, res) => {
  res.status(200).send("API Middleware online");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Middleware rodando na porta ${PORT}`);
});
