import { Request, Response } from "express";
import { getAccessToken } from "../services/authService";
import axiosInstance from "../services/axiosInstance";

export async function getContact(req: Request, res: Response) {
  const token = await getAccessToken();

  try {
    const resp = await axiosInstance.get(
      `${process.env.EGESTOR_API_URL}/v1/contatos`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { per_page: 1 },
        timeout: 10_000,
      }
    );

    const codigo = resp?.data?.data?.[0]?.codigo;

    if (codigo == null) {
      return res.status(404).json({ error: "Nenhum contato encontrado" });
    }

    // const detail = await axiosInstance.get(
    //   `${process.env.EGESTOR_API_URL}/v1/contatos/${codigo}`,
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   }
    // );

    return res.json({ codigo });
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const msg =
      status === 404 ? "Nenhum contato encontrado" : "Falha ao buscar contatos";
    return res.status(status).json({ error: msg });
  }
}
