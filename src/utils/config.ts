import fs from "fs";
import path from "path";

export function getConfiguredToken(): string {
  const configPath = path.resolve(__dirname, "../config/config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("Arquivo de configuração (config.json) não encontrado.");
  }

  const file = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(file);

  if (!config.egestorToken) {
    throw new Error("Token da API não configurado em config.json.");
  }

  return config.egestorToken;
}
