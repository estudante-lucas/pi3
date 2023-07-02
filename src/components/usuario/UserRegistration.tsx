import Usuario from "@models/Usuario";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const UserForm: React.FC = () => {
	const router = useRouter();
	const onFinish = async (usuario: Usuario) => {
		try {
			const response = await fetch("/api/cadastros/usuario", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(usuario),
			});

			if (!response.ok) {
				const body = await response.json();
				throw new Error(body.message);
			}
			message.success("Usuário cadastrado com sucesso!");
			setTimeout(() => router.push("/cadastros/usuarios"), 3000);
		} catch (error: any) {
			message.error("Ocorreu um erro! Tente novamente mais tarde");
			console.error(error.message);
		}
	};

	return (
		<Form onFinish={onFinish}>
			<Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Por favor, insira seu nome!" }]}>
				<Input />
			</Form.Item>

			<Form.Item
				label="Email"
				name="email"
				rules={[
					{ required: true, message: "Por favor, insira seu email!" },
					{
						type: "email",
						message: "Por favor, insira um e-mail válido",
					},
				]}
			>
				<Input />
			</Form.Item>

			<Form.Item label="Senha" name="senha" rules={[{ required: true, message: "Por favor, insira sua senha!" }]}>
				<Input.Password />
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Cadastrar
				</Button>
			</Form.Item>
		</Form>
	);
};

export default UserForm;
