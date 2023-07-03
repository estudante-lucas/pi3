import Coluna from "@models/Coluna";
import Quadro from "@models/Quadro";
import { Button, Card, Col, Dropdown, MenuProps, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

interface ColunaDTO extends Partial<Coluna> {
	Projetos?: any[];
}

interface QuadroDTO extends Partial<Quadro> {
	Colunas: ColunaDTO[];
}

const KanbanBoard: React.FC = () => {
	const [isKanbanLoading, setIsKanbanLoading] = useState(false);
	const [quadros, setQuadros] = useState<QuadroDTO[]>([]);
	const [quadroSelecionado, setQuadroSelecionado] = useState<QuadroDTO>();

	useEffect(() => {
		setIsKanbanLoading(true);
		fetch("/api/cadastros/quadros")
			.then((response) => response.json())
			.then((data) => setQuadros(data))
			.catch((error) => console.error("Erro ao obter lista de usuários:", error))
			.finally(() => setIsKanbanLoading(false));
	}, []);

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, projetoId: number) => {
		e.dataTransfer.setData("projetoId", String(projetoId));
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, colunaId: number) => {
		const projetoId = Number(e.dataTransfer.getData("projetoId"));
		const destinationColuna = quadroSelecionado?.Colunas?.find((coluna) => coluna.id === colunaId);
		const sourceColuna = quadroSelecionado?.Colunas?.find((coluna) => coluna.Projetos?.some((projeto) => projeto.id === projetoId));

		if (destinationColuna && sourceColuna) {
			if (destinationColuna.id !== sourceColuna.id) {
				const updatedColunas = addProjetoToColuna(destinationColuna, projetoId);
				removeProjetoFromColuna(sourceColuna, projetoId);

				atualizarColunas(updatedColunas);
			}
		}
	};

	const atualizarColunas = (colunas: ColunaDTO[]) => {
		setQuadroSelecionado({ ...quadroSelecionado, Colunas: colunas });
	};

	const addProjetoToColuna = (destinationColuna: ColunaDTO, projetoId: number): ColunaDTO[] => {
		const projetoExists = destinationColuna.Projetos?.find((projeto) => projeto.id === projetoId);
		if (!projetoExists) {
			const projeto = {
				id: projetoId,
				nome: "Título da tarefa",
				description: "Descrição da tarefa",
				responsavel: "Lucas",
			};
			return quadroSelecionado!.Colunas.map((coluna) => {
				if (coluna.id === destinationColuna.id) {
					return {
						...coluna,
						Projetos: [...(coluna.Projetos || []), projeto],
					};
				}
				return coluna;
			});
		}
		return quadroSelecionado!.Colunas;
	};

	const removeProjetoFromColuna = (coluna: ColunaDTO, projetoId: number): void => {
		coluna.Projetos = coluna.Projetos?.filter((projeto) => projeto.id !== projetoId);
	};

	const onClick: MenuProps["onClick"] = ({ key }) => {
		setQuadroSelecionado(quadros[Number(key)]);
	};

	const items: MenuProps["items"] = quadros.map((quadro, index) => {
		return {
			key: index,
			label: quadro.nome,
		};
	});

	const newLocal = quadroSelecionado?.Colunas.map((coluna, _, array) => (
		<Col key={coluna.id} span={array.length < 5 ? 24 / array.length : 5}>
			<Card
				title={<Title level={4}>{coluna.nome}</Title>}
				style={{ marginBottom: "16px" }}
				headStyle={{ backgroundColor: "#f4f4f4" }}
				bodyStyle={{ minHeight: "100px", padding: "8px" }}
				onDragOver={handleDragOver}
				onDrop={(e) => handleDrop(e, coluna.id!)}
			>
				{coluna.Projetos?.map((projeto) => (
					<Card
						key={projeto.id}
						draggable
						onDragStart={(e) => handleDragStart(e, projeto.id)}
						style={{
							marginBottom: "8px",
							backgroundColor: "#b2b2b2",
						}}
					>
						<Title level={3}>{projeto.nome}</Title>
						<p>{projeto.description}</p>
						<p style={{ fontSize: "12px" }}>{projeto.responsavel}</p>
					</Card>
				))}
			</Card>
		</Col>
	));

	const newLocal_1 = quadroSelecionado ? <Col>As colunas adicionadas ao quadro irão aparecer aqui</Col> : "";

	return (
		<>
			<Row>
				<Dropdown menu={{ items, onClick, selectable: true }}>
					<Button>
						<Space>{quadroSelecionado?.nome || "Selecione um quadro"}</Space>
					</Button>
				</Dropdown>
			</Row>
			<Row gutter={16} wrap={false} style={{ overflow: "scroll", minHeight: "100vh" }}>
				{newLocal?.length == 0 ? newLocal_1 : newLocal}
			</Row>
		</>
	);
};

export default KanbanBoard;
