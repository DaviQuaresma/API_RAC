import fs from "fs";
import path from "path";

const logsDir = path.resolve(process.cwd(), "logs");
const fallbackPath = path.resolve(logsDir, "fallback.json");

export function salvarFallback(produto: any) {
  try {
    if (!fs.existsSync(logsDir)) {
      console.log("⚙ Criando pasta logs...");
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const fallbackAtual = fs.existsSync(fallbackPath)
      ? JSON.parse(fs.readFileSync(fallbackPath, "utf-8"))
      : [];

    fallbackAtual.push(produto);

    fs.writeFileSync(fallbackPath, JSON.stringify(fallbackAtual, null, 2));

    console.log(
      `📦 Produto salvo no fallback: ${
        produto.codigoProprio || produto.codigo || "sem código"
      }`
    );
  } catch (err) {
    console.error("[ERRO ao salvar fallback]", err);
  }
}
