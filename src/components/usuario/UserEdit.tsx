import Usuario from "@models/Usuario";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";

export interface UserEditProps {
	userId: number;
}

const UserEdit: React.FC<UserEditProps> = ({ userId }) => {
	const router = useRouter();
	const [user, setUser] = useState<Usuario | null>(null);

	useEffect(() => {
		// Função para buscar informações do usuário por ID na API
		const fetchUser = async () => {
			try {
				const response = await fetch(`/api/cadastros/usuario/${userId}`);
				const data = await response.json();
				setUser(data);
			} catch (error) {
				console.error("Erro ao buscar informações do usuário", error);
			}
		};

		fetchUser();
	}, [userId]);

	const handleSubmit = (values: any) => {
		message.success("Usuário salvo com sucesso");
		router.push("/cadastros/usuarios");
	};

	if (!user) {
		return <Loading />;
	}

	return (
		<div>
			<h1>Editar Usuário</h1>
			<Form onFinish={handleSubmit} initialValues={user}>
				<Form.Item label="Nome" name="nome" rules={[{ required: true, message: "Por favor, insira o nome" }]}>
					<Input value={user.nome} />
				</Form.Item>
				<Form.Item
					label="E-mail"
					name="email"
					rules={[
						{
							required: true,
							message: "Por favor, insira o e-mail",
						},
						{
							type: "email",
							message: "Por favor, insira um e-mail válido",
						},
					]}
				>
					<Input value={user.email} />
				</Form.Item>
				<Button type="primary" htmlType="submit">
					Salvar
				</Button>
			</Form>
		</div>
	);
};

export default UserEdit;
