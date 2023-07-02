import { criarQuadro } from "@/services/QuadroService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function criarQuadroHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		const { nome } = req.body;
		const quadro = await criarQuadro({ nome });

		return res.status(201).json(quadro);
	} catch (error: any) {
		const message = error.errors[0].message;
		console.error("Erro ao cadastrar quadro:", message);
		return res.status(500).json({ message });
	}
}
