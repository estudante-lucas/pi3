import { Button, Col, Row, Skeleton, Table } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UsersList: React.FC = () => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		setLoading(true);
		fetch("/api/cadastros/usuarios")
			.then((response) => response.json())
			.then((data) => setUsers(data))
			.catch((error) => console.error("Erro ao obter lista de usuários:", error))
			.finally(() => setLoading(false));
	}, []);

	const onRow = (user: User) => {
		router.push(`/cadastros/usuario/${user.id}`);
	};

	const columns = [
		{
			title: "Nome",
			dataIndex: "nome",
			key: "nome",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
	];

	const CustomSkeleton = () => (
		<Row gutter={64}>
			<Col span={12}>
				<Skeleton paragraph={false} active />
			</Col>
			<Col span={10}>
				<Skeleton paragraph={false} active />
			</Col>
		</Row>
	);

	const multipleSkeleton = () => {
		return (
			<>
				<CustomSkeleton />
				<CustomSkeleton />
				<CustomSkeleton />
			</>
		);
	};

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
			<Table
				dataSource={users}
				columns={columns}
				rowKey="id"
				onRow={(record) => ({ onClick: () => onRow(record) })}
				locale={{
					emptyText: loading ? multipleSkeleton() : "Usuários cadastrados aparecerão aqui",
				}}
			/>
		</>
	);
};

export default UsersList;
