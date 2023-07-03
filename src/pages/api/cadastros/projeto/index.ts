import { criarProjeto } from "@/services/ProjetoService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function criarProjetoHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		const { nome, coluna } = req.body;
		const projeto = await criarProjeto({ nome, coluna });

		return res.status(201).json(projeto);
	} catch (error: any) {
		const message = error?.errors?.[0].message || error.message;
		console.error("Erro ao cadastrar projeto:", message);
		return res.status(500).json({ message });
	}
}
