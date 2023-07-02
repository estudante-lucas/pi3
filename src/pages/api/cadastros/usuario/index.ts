import { criarUsuario } from "@/services/UsuarioService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function criarUsuarioHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		const { email, senha, nome } = req.body;
		const usuario = await criarUsuario({ email, senha, nome });

		return res.status(201).json(usuario);
	} catch (error: any) {
		const message = error.errors[0].message;
		console.error("Erro ao cadastrar usuário:", message);
		return res.status(500).json({ message });
	}
}
