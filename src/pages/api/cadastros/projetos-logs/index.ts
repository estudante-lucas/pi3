import { obterPorUsuario } from "@/services/ProjetoLogService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function obterProjetoLogsHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		const { idUsuario } = req.query;
		const usuario = Number(idUsuario);

		if (Number.isNaN(usuario)) {
			throw new Error("Parâmerto idUsuario deve ser um número");
		}

		const logs = await obterPorUsuario(usuario);

		return res.status(200).json(logs);
	} catch (error: any) {
		const message = error.message;
		console.error("Erro ao obter logs do projeto:", message);
		return res.status(500).json({ message });
	}
}
