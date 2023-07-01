import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const BoardRegistration: React.FC = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async (values: any) => {
		setIsLoading(true);

		try {
			// Simular uma requisição assíncrona de salvamento
			await saveBoard(values);

			message.success("Quadro salvo com sucesso!");
			router.push("/cadastros/quadros");
		} catch (error) {
			message.error("Erro ao salvar o quadro. Tente novamente mais tarde.");
		} finally {
			setIsLoading(false);
		}
	};

	const saveBoard = (boardData: any) => {
		// Implemente aqui a lógica para salvar o quadro
		return new Promise<void>((resolve, reject) => {
			// Simulação de uma requisição assíncrona
			setTimeout(() => {
				// Em caso de sucesso, resolva a Promise
				resolve();
				// Em caso de erro, rejeite a Promise
				// reject(new Error("Erro ao salvar o quadro."));
			}, 2000);
		});
	};

	return (
		<div>
			<h1>Novo Quadro</h1>

			<Form onFinish={handleSave}>
				<Form.Item label="Nome do Quadro" name="name" rules={[{ required: true, message: "Informe o nome do quadro" }]}>
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
