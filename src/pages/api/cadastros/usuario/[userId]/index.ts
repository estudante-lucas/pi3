import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { userId: rawUserId } = req.query;
	const userId: number = Number(rawUserId);

	const users: User[] = [
		{ id: 1, name: "John Doe", email: "john@example.com" },
		{ id: 2, name: "Jane Smith", email: "jane@example.com" },
		{ id: 3, name: "Bob Johnson", email: "bob@example.com" },
	];

	const user = users.find((user) => user.id === userId);

	res.status(200).json(user);
}
