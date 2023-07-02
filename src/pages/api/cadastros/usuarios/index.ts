import { obterTodosUsuarios } from "@/services/UsuarioService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function obterTodosUsuariosHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const usuarios = await obterTodosUsuarios();
		res.status(200).json(usuarios);
	} catch (error) {
		console.error("Erro ao obter todos os usuários:", error);
		res.status(500).json({ message: "Erro ao obter todos os usuários" });
	}
}
