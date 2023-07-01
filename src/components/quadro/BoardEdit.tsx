import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";

export interface BoardEditProps {
	boardId: number;
}

const BoardEdit: React.FC<BoardEditProps> = ({ boardId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [board, setBoard] = useState<Board | null>(null);

	useEffect(() => {
		fetchBoard()
			.then((data) => {
				setBoard(data);
			})
			.catch((error) => {
				message.error("Erro ao buscar os dados do quadro. Tente novamente mais tarde.");
			});
	}, [boardId]);

	const fetchBoard = async () => {
		const response = await fetch(`/api/cadastros/quadro/${boardId}`);
		const data: Board = await response.json();
		return data;
	};

	const handleSubmit = (values: any) => {
		setIsLoading(true);

		// Simulação de uma requisição assíncrona para atualizar os dados do quadro
		updateBoard(values)
			.then(() => {
				message.success("Quadro atualizado com sucesso!");
				// Atualizar os dados do quadro com os valores do formulário
				setBoard((prevBoard) => ({ ...prevBoard, ...values }));
			})
			.catch((error) => {
				message.error("Erro ao atualizar o quadro. Tente novamente mais tarde.");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const updateBoard = (boardData: any) => {
		// Implemente aqui a lógica para atualizar os dados do quadro
		return new Promise<void>((resolve, reject) => {
			// Simulação de uma requisição assíncrona
			setTimeout(() => {
				// Em caso de sucesso, resolva a Promise
				resolve();
				// Em caso de erro, rejeite a Promise
				// reject(new Error("Erro ao atualizar o quadro."));
			}, 2000);
		});
	};

	if (!board) {
		return <Loading />;
	}

	return (
		<div>
			<h1>Editar Quadro</h1>

			<Form onFinish={handleSubmit} initialValues={board} layout="vertical">
				<Form.Item label="Nome" name="name" rules={[{ required: true, message: "Por favor, insira o nome do quadro." }]}>
					<Input value={board.name} />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" loading={isLoading}>
						Salvar
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default BoardEdit;
