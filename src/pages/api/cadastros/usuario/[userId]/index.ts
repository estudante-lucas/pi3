import { obterUsuario } from "@/services/UsuarioService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function obterUsuarioHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { userId: rawUserId } = req.query;
		const userId: number = Number(rawUserId);

		const usuario = await obterUsuario(userId);

		if (!usuario) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		res.status(200).json(usuario);
	} catch (error) {
		console.error("Erro ao obter usuário:", error);
		res.status(500).json({ error: "Erro ao obter usuário" });
	}
}
