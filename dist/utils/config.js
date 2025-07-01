"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfiguredToken = getConfiguredToken;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getConfiguredToken() {
    const configPath = path_1.default.resolve(__dirname, "../config/config.json");
    console.log("📄 Buscando token em:", configPath);
    if (!fs_1.default.existsSync(configPath)) {
        throw new Error("Arquivo de configuração (config.json) não encontrado.");
    }
    const file = fs_1.default.readFileSync(configPath, "utf-8");
    const config = JSON.parse(file);
    if (!config.egestorToken) {
        throw new Error("Token da API não configurado em config.json.");
    }
    return config.egestorToken;
}
