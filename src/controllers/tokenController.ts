import fs from "fs";
import path from "path";
import { Request, Response } from "express";

export default async function validarToken(
  req: Request,
  res: Response
): Promise<any> {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ erro: "Token não fornecido" });
  }

  const configPath = path.resolve(__dirname, "../config/config.json");
  fs.writeFileSync(
    configPath,
    JSON.stringify({ egestorToken: token }, null, 2)
  );

  res.status(200).json({ mensagem: "Token atualizado com sucesso" });
}
