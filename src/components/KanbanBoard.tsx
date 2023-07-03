import Coluna from "@models/Coluna";
import Projeto from "@models/Projeto";
import Quadro from "@models/Quadro";
import Usuario from "@models/Usuario";
import { Button, Card, Col, Dropdown, MenuProps, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface ProjetoDTO extends Partial<Projeto> {
	Usuario?: Partial<Usuario>;
}

interface ColunaDTO extends Partial<Coluna> {
	Projetos?: ProjetoDTO[];
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

	const colunasDoQuadro = quadroSelecionado?.Colunas.map((coluna, _, array) => (
		<Col key={coluna.id} span={array.length < 5 ? 24 / array.length : 5}>
			<Card
				title={<Title level={4}>{coluna.nome}</Title>}
				style={{ marginBottom: "16px", height: "88vh" }}
				headStyle={{ backgroundColor: "#e4e4e4" }}
				bodyStyle={{ minHeight: "79vh", padding: "8px", backgroundColor: "#e4e4e4" }}
				onDragOver={handleDragOver}
				onDrop={(e) => handleDrop(e, coluna.id!)}
			>
				{coluna.Projetos?.map((projeto) => (
					<Card
						title={projeto.nome}
						key={projeto.id}
						draggable
						onDragStart={(e) => handleDragStart(e, projeto.id!)}
						style={{
							marginBottom: "8px",
							backgroundColor: "#c4c4c4",
						}}
					>
						<Text>{"Responsável: " + (projeto.Usuario?.nome || "Não atribuído")}</Text>
					</Card>
				))}
			</Card>
		</Col>
	));

	const quadroVazio = quadroSelecionado ? <Col>As colunas adicionadas ao quadro irão aparecer aqui</Col> : "";

	return (
		<Space direction="vertical" style={{ width: "100%" }}>
			<Row>
				<Dropdown menu={{ items, onClick, selectable: true }}>
					<Button>
						<Space>{quadroSelecionado?.nome || "Selecione um quadro"}</Space>
					</Button>
				</Dropdown>
			</Row>
			<Row gutter={16} wrap={false} style={{ overflow: "scroll" }}>
				{colunasDoQuadro?.length == 0 ? quadroVazio : colunasDoQuadro}
			</Row>
		</Space>
	);
};

export default KanbanBoard;
