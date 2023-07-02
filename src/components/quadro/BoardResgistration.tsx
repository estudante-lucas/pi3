import { SaveOutlined } from "@ant-design/icons";
import Quadro from "@models/Quadro";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const BoardRegistration: React.FC = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async (values: Pick<Quadro, "nome">) => {
		setIsLoading(true);
		await saveBoard(values);
	};

	const saveBoard = async (quadro: Pick<Quadro, "nome">) => {
		try {
			const response = await fetch("/api/cadastros/quadro", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(quadro),
			});

			if (!response.ok) {
				const body = await response.json();
				throw new Error(body.message);
			}
			message.success("Quadro cadastrado com sucesso!");
			setTimeout(() => router.push("/cadastros/quadros"), 3000);
		} catch (error: any) {
			message.error("Ocorreu um erro! Tente novamente mais tarde");
			console.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h1>Novo Quadro</h1>

			<Form onFinish={handleSave}>
				<Form.Item label="Nome do Quadro" name="nome" rules={[{ required: true, message: "Informe o nome do quadro" }]}>
					<Input placeholder="Digite o nome do quadro" />
				</Form.Item>

				<Form.Item>
					<Button type="primary" icon={<SaveOutlined />} loading={isLoading} htmlType="submit">
						Salvar
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default BoardRegistration;
