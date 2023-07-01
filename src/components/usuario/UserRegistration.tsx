import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const UserForm: React.FC = () => {
	const router = useRouter();
	const onFinish = (values: any) => {
		console.log(values);
		router.push("/cadastros/usuario");
	};

	return (
		<Form onFinish={onFinish}>
			<Form.Item label="Nome" name="name" rules={[{ required: true, message: "Por favor, insira seu nome!" }]}>
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

			<Form.Item label="Senha" name="password" rules={[{ required: true, message: "Por favor, insira sua senha!" }]}>
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
