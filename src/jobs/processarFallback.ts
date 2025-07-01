import fs from "fs";
import path from "path";
import axiosInstance from "../services/axiosInstance";
import { getAccessToken } from "../services/authService";
import { ProdutoSchema } from "../schemas/produtoSchema";

// Em vez de __dirname, que aponta pro dist/jobs
const logsDir = path.join(process.cwd(), 'logs');
const fallbackPath = path.join(logsDir, 'fallback.json');

// Garante que o diretório exista
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export async function processarFallback(): Promise<void> {
  console.log("[Fallback] Iniciando processamento do fallback.json");

  if (!fs.existsSync(fallbackPath)) {
    console.log("[Fallback] Nenhum fallback pendente.");
    return;
  }

  const fallbackRaw = fs.readFileSync(fallbackPath, "utf-8");
  let fallbackData = [];

  try {
    fallbackData = JSON.parse(fallbackRaw);
  } catch (e) {
    console.error("[Fallback] JSON mal formatado:", e);
    return;
  }

  if (!Array.isArray(fallbackData) || fallbackData.length === 0) {
    console.log("[Fallback] Lista vazia, nada a processar.");
    return;
  }

  const token = await getAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const novosFallbacks = [];

  for (const produto of fallbackData) {
    try {
      const valid = ProdutoSchema.safeParse(produto);

      if (!valid.success) {
        console.warn(
          `[Fallback] Produto inválido ignorado: ${produto.codigoProprio}`
        );
        continue;
      }

      const endpoint = produto.codigo
        ? `${process.env.EGESTOR_API_URL}/v1/produtos/${produto.codigo}`
        : `${process.env.EGESTOR_API_URL}/v1/produtos`;

      const method = produto.codigo ? "put" : "post";
      const payload = produto.codigo
        ? { ...produto, codigo: undefined }
        : produto;

      const { data } = await axiosInstance[method](endpoint, payload, {
        headers,
      });

      console.log(
        ` Fallback reprocessado: ${produto.codigoProprio} (${data.codigo})`
      );
    } catch (err: any) {
      console.error(
        `[Fallback] Falha ao reenviar ${produto.codigoProprio}:`,
        err?.response?.data || err.message
      );
      novosFallbacks.push(produto); // Reinsere para tentar depois
    }
  }

  if (novosFallbacks.length > 0) {
    fs.writeFileSync(fallbackPath, JSON.stringify(novosFallbacks, null, 2));
    console.log(`[Fallback] ${novosFallbacks.length} produtos ainda com erro.`);
  } else {
    fs.unlinkSync(fallbackPath);
    console.log(
      "[Fallback] Todos os produtos processados com sucesso. Arquivo removido."
    );
  }
}
