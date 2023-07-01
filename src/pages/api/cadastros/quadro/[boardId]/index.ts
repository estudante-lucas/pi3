import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { boardId: rawBoardId } = req.query;
	const boardId: number = Number(rawBoardId);

	const boards: Board[] = [
		{
			id: 1,
			name: "Quadro 1",
			columns: [
				{
					id: 1,
					title: "A fazer",
					board: 1,
					position: 0,
					tasks: [],
				},
				{
					id: 2,
					title: "Em andamento",
					board: 1,
					position: 1,
					tasks: [],
				},
				{
					id: 3,
					title: "Concluido",
					board: 1,
					position: 2,
					tasks: [],
				},
			],
		},
		{ id: 2, name: "Quadro 2", columns: [] },
		{ id: 3, name: "Quadro 3", columns: [] },
	];

	const board = boards.find((board) => board.id === boardId);

	res.status(200).json(board);
}
