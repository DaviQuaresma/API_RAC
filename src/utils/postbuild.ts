import fs from "fs";
import path from "path";

const srcPath = path.resolve(__dirname, "../../src/config/config.json");
const destDir = path.resolve(__dirname, "../config");
const destPath = path.resolve(destDir, "config.json");

if (!fs.existsSync(srcPath)) {
  console.error("❌ Arquivo config.json de origem não encontrado.");
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcPath, destPath);
console.log("✅ config.json copiado para dist/config com sucesso.");
