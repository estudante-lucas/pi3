import { criarColuna } from "@/services/ColunaService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function criarColunaHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		const { nome, quadro, posicao } = req.body;
		const coluna = await criarColuna({ nome, quadro, posicao });

		return res.status(201).json(coluna);
	} catch (error: any) {
		const message = error?.errors?.[0].message || error.message;
		console.error("Erro ao cadastrar coluna:", message);
		return res.status(500).json({ message });
	}
}
