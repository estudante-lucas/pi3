import { obterTodosQuadros } from "@/services/QuadroService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function obterTodosQuadrosHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const quadros = await obterTodosQuadros();
		res.status(200).json(quadros);
	} catch (error) {
		console.error("Erro ao obter todos os quadro:", error);
		res.status(500).json({ message: "Erro ao obter todos os quadro" });
	}
}
