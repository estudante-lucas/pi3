import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const column = req.body;

		//TODO
		// Salvar coluna no banco de dados
		// Retornar a coluna salva no banco com o id
		column.id = 123;

		res.status(201).json(column);
	} else {
		res.status(404);
	}
}
