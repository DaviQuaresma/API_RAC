import fs from "fs";
import path from "path";

const logsDir = path.resolve(process.cwd(), "logs");

export function salvarFallback(tipo: "produto" | "venda", data: any) {
  try {
    if (!fs.existsSync(logsDir)) {
      console.log("⚙ Criando pasta logs...");
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const fallbackPath = path.resolve(logsDir, `fallback-${tipo}.json`);

    const fallbackAtual = fs.existsSync(fallbackPath)
      ? JSON.parse(fs.readFileSync(fallbackPath, "utf-8"))
      : [];

    fallbackAtual.push(data);

    fs.writeFileSync(fallbackPath, JSON.stringify(fallbackAtual, null, 2));

    console.log(`💾 Fallback salvo (${tipo}): ${JSON.stringify(data)}`);
  } catch (err) {
    console.error(`[ERRO ao salvar fallback - ${tipo}]`, err);
  }
}
