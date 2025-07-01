"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const produtosRoutes_1 = __importDefault(require("./routes/produtosRoutes"));
const validacaoRoutes_1 = __importDefault(require("./routes/validacaoRoutes"));
const vendaRoutes_1 = __importDefault(require("./routes/vendaRoutes"));
const tokenRoutes_1 = __importDefault(require("./routes/tokenRoutes"));
const fallbackRoutes_1 = __importDefault(require("./routes/fallbackRoutes"));
require("./jobs/fallbackScheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", produtosRoutes_1.default);
app.use("/api", validacaoRoutes_1.default);
app.use("/api", vendaRoutes_1.default);
app.use("/api", tokenRoutes_1.default);
app.use("/api", fallbackRoutes_1.default);
app.get("/health", (_, res) => {
    res.status(200).send("API Middleware online");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Middleware rodando na porta ${PORT}`);
});
