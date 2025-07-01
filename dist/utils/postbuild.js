"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const srcPath = path_1.default.resolve(__dirname, "../../src/config/config.json");
const destDir = path_1.default.resolve(__dirname, "../config");
const destPath = path_1.default.resolve(destDir, "config.json");
if (!fs_1.default.existsSync(srcPath)) {
    console.error("❌ Arquivo config.json de origem não encontrado.");
    process.exit(1);
}
if (!fs_1.default.existsSync(destDir)) {
    fs_1.default.mkdirSync(destDir, { recursive: true });
}
fs_1.default.copyFileSync(srcPath, destPath);
console.log("✅ config.json copiado para dist/config com sucesso.");
