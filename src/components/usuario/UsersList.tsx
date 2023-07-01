import { Button, Table } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const UsersList: React.FC = () => {
	const router = useRouter();

	const onRow = (user: User) => {
		router.push(`/cadastros/usuario/${user.id}`);
	};

	const users: User[] = [
		{ id: 1, name: "John Doe", email: "john@example.com" },
		{ id: 2, name: "Jane Smith", email: "jane@example.com" },
		{ id: 3, name: "Bob Johnson", email: "bob@example.com" },
	];

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
	];

	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<h1 style={{ marginRight: "16px" }}>Lista de usuários</h1>
				<Button type="primary" onClick={() => router.push("usuario")}>
					Adicionar
				</Button>
			</div>
			<Table dataSource={users} columns={columns} rowKey="id" onRow={(record) => ({ onClick: () => onRow(record) })} />
		</>
	);
};

export default UsersList;
