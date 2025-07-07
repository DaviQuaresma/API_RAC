import fs from "fs";
import path from "path";
import axiosInstance from "../services/axiosInstance";
import { getAccessToken } from "../services/authService";
import { ProdutoSchema } from "../schemas/produtoSchema";

const logsDir = path.join(process.cwd(), "logs");
const fallbackPath = path.join(logsDir, "fallback.json");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export async function processarFallback(): Promise<void> {
  console.log("[Fallback] Iniciando processamento do fallback.json");

  if (!fs.existsSync(fallbackPath)) {
    console.log("[Fallback] Nenhum fallback pendente.");
    return;
  }

  let fallbackData: any[] = [];

  try {
    const raw = fs.readFileSync(fallbackPath, "utf-8");
    fallbackData = JSON.parse(raw);
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

  for (const item of fallbackData) {
    try {
      // 🔍 Heurística simples para saber se é produto ou venda
      const isProduto = ProdutoSchema.safeParse(item).success;
      const isVenda = item?.codContato && item?.produtos?.length;

      if (isProduto) {
        const endpoint = item.codigo
          ? `${process.env.EGESTOR_API_URL}/v1/produtos/${item.codigo}`
          : `${process.env.EGESTOR_API_URL}/v1/produtos`;

        const method = item.codigo ? "put" : "post";
        const payload = item.codigo ? { ...item, codigo: undefined } : item;

        const { data } = await axiosInstance[method](endpoint, payload, {
          headers,
        });

        console.log(
          `✅ Produto reprocessado: ${item.codigoProprio} (${data.codigo})`
        );
      } else if (isVenda) {
        const vendaResponse = await axiosInstance.post(
          `${process.env.EGESTOR_API_URL}/v1/vendas`,
          item,
          { headers }
        );

        const codigoVenda = vendaResponse.data.codigo;

        // Tenta gerar NFC-e após criação
        await axiosInstance.post(
          `${process.env.EGESTOR_API_URL}/v1/vendas/${codigoVenda}/gerarNfce`,
          {
            cpfcnpj: item?.cpfcnpj || 12345678912,
            indPres: item?.indPres || 1,
            codTransportadora: item?.codTransportadora || 0,
          },
          { headers }
        );

        console.log(`✅ Venda reprocessada: ${codigoVenda}`);
      } else {
        console.warn("[Fallback] Tipo de item não reconhecido:", item);
        novosFallbacks.push(item);
      }
    } catch (err: any) {
      console.error(
        "[Fallback] Falha ao reenviar item:",
        err?.response?.data || err.message
      );
      novosFallbacks.push(item); // Mantém para nova tentativa depois
    }
  }

  if (novosFallbacks.length > 0) {
    fs.writeFileSync(fallbackPath, JSON.stringify(novosFallbacks, null, 2));
    console.log(`[Fallback] ${novosFallbacks.length} itens ainda com erro.`);
  } else {
    fs.unlinkSync(fallbackPath);
    console.log(
      "[Fallback] Todos os itens processados com sucesso. Arquivo removido."
    );
  }
}
