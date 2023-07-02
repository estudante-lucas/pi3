import { obterQuadro } from "@/services/QuadroService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function obterQuadroHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { boardId: rawUserId } = req.query;
		const boardId: number = Number(rawUserId);

		const quadro = await obterQuadro(boardId);

		if (!quadro) {
			return res.status(404).json({ error: "Quadro não encontrado" });
		}

		res.status(200).json(quadro);
	} catch (error) {
		console.error("Erro ao obter quadro:", error);
		res.status(500).json({ error: "Erro ao obter quadro" });
	}
}
