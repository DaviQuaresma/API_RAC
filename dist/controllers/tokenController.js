"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validarToken;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function validarToken(req, res) {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ erro: "Token não fornecido" });
    }
    const configDir = path_1.default.resolve(__dirname, "../config");
    const configPath = path_1.default.join(configDir, "config.json");
    if (!fs_1.default.existsSync(configDir)) {
        fs_1.default.mkdirSync(configDir, { recursive: true });
    }
    fs_1.default.writeFileSync(configPath, JSON.stringify({ egestorToken: token }, null, 2));
    res.status(200).json({ mensagem: "Token atualizado com sucesso" });
}
