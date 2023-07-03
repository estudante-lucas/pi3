import { obterTodasColunas } from "@/services/ColunaService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function obterTodasColunasHandler(_: NextApiRequest, res: NextApiResponse) {
	try {
		const colunas = await obterTodasColunas();
		res.status(200).json(colunas);
	} catch (error) {
		console.error("Erro ao obter todos os coluna:", error);
		res.status(500).json({ message: "Erro ao obter todos os coluna" });
	}
}
