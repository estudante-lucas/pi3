import Coluna from "@models/Coluna";
import Projeto from "@models/Projeto";
import Quadro from "@models/Quadro";
import Usuario from "@models/Usuario";
import { Button, Card, Col, Dropdown, Empty, Input, List, MenuProps, Modal, Row, Select, Space, Typography } from "antd";
import { Option } from "antd/es/mentions";
import moment from "moment";
import "moment/locale/pt-br";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface ProjetoDTO extends Partial<Projeto> {
	usuarioResponsavel?: Partial<Usuario>;
	criador?: Partial<Usuario>;
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

	moment.locale("pt-br");

	useEffect(() => {
		setIsKanbanLoading(true);
		fetch("/api/cadastros/quadros")
			.then((response) => response.json())
			.then((data) => {
				if (data[0]) setQuadroSelecionado(data[0]);
				setQuadros(data);
			})
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

	const [projetoSelecionado, setProjetoSelecionado] = useState<ProjetoDTO | null>(null);
	const handleClickCard = (projeto: ProjetoDTO) => {
		setProjetoSelecionado(projeto);
	};

	const colunasDoQuadro = quadroSelecionado?.Colunas.sort((a, b) => a.posicao! - b.posicao!).map((coluna, _, array) => (
		<Col key={coluna.id} span={array.length < 5 ? 24 / array.length : 5}>
			<Card
				title={
					<Title ellipsis title={coluna.nome} level={4}>
						{coluna.nome}
					</Title>
				}
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
						onClick={() => handleClickCard(projeto)}
						style={{
							marginBottom: "8px",
							backgroundColor: "#c4c4c4",
						}}
					>
						<Row>
							<Text strong>Responsável:&nbsp;</Text>
							<Text>{projeto.usuarioResponsavel?.nome || "Não atribuído"}</Text>
						</Row>
						<Row>
							{coluna.nome != "A Fazer" && (
								<>
									<Text strong>Iniciado em:&nbsp;</Text>
									<Text>{moment(projetoSelecionado?.criadoEm).format("DD/MM/YYYY")}</Text>
								</>
							)}
						</Row>
					</Card>
				))}
			</Card>
		</Col>
	));

	const quadroVazio = quadroSelecionado ? <Col>As colunas adicionadas ao quadro irão aparecer aqui</Col> : "";

	// MODAL
	const usuariosCadastrados = ["Lucas", "Maria", "Pedro"]; // Lista de usuários cadastrados
	const [responsavel, setResponsavel] = useState("Lucas"); // Estado para armazenar o responsável

	const handleResponsavelChange = (value: string) => {
		setResponsavel(value); // Atualiza o estado do responsável
	};

	const [comentario, setComentario] = useState("");
	const [comentarios, setComentarios] = useState<any[]>([]);

	const handleComentarioChange = (e: any) => {
		setComentario(e.target.value);
	};

	const handleComentarioSubmit = () => {
		if (comentario.trim() !== "") {
			const commentBody = {
				responsavel: "Lucas",
				criadoEm: new Date(),
				mensagem: comentario,
			};

			setComentarios([...comentarios, commentBody]);
			setComentario("");
		}
	};

	const [saveCommentButtonVisible, setSaveCommentButtonVisible] = useState(false);

	const closeModal = () => {
		setComentario("");
		setComentarios([]);
		setProjetoSelecionado(null);
	};

	const handleTituloProjetoSelecionado = (e: any) => {
		const tempProjeto = { ...projetoSelecionado };

		const value = e.target.value;
		tempProjeto.nome = value;

		setProjetoSelecionado(tempProjeto);
	};

	const adicionarProjeto = () => {
		const novoProjeto: ProjetoDTO = {
			criador: {
				nome: "Lucas",
			},
		};

		setProjetoSelecionado(novoProjeto);
	};

	return (
		<>
			<Space direction="vertical" style={{ width: "100%" }}>
				<Row>
					<Col span={4}>
						<Dropdown menu={{ items, onClick, selectable: true }}>
							<Button>
								<Space>{quadroSelecionado?.nome || "Selecione um quadro"}</Space>
							</Button>
						</Dropdown>
					</Col>
					<Col>
						<Button type="primary" onClick={adicionarProjeto}>
							<Space>Adicionar Projeto</Space>
						</Button>
					</Col>
				</Row>
				{quadroSelecionado?.Colunas.length! > 0 ? (
					<Row gutter={16} wrap={false} style={{ overflow: "scroll" }}>
						{colunasDoQuadro?.length == 0 ? quadroVazio : colunasDoQuadro}
					</Row>
				) : (
					<Row align={"middle"} style={{ height: "80vh" }}>
						<Col span={12} offset={6}>
							<Empty description={"As colunas adicionadas ao quadro irão aparecer aqui"} />
						</Col>
					</Row>
				)}
			</Space>
			<Modal centered width={"60vw"} open={!!projetoSelecionado} onCancel={closeModal} footer style={{ backgroundColor: "#000000" }}>
				<Row gutter={[16, 16]}>
					<Col span={16}>
						<Card style={{ border: "none" }}>
							<Title level={5}>Título</Title>
							<Input value={projetoSelecionado?.nome} style={{ fontSize: "2em", wordWrap: "break-word", border: "none", padding: 0 }} onChange={handleTituloProjetoSelecionado} placeholder="Adicione um título..." />
							<Title level={5}>Descrição</Title>
							<Input.TextArea
								style={{ border: "none", padding: 0, boxShadow: "none" }}
								value={projetoSelecionado?.descricao || ""}
								placeholder="Adicionar descrição..."
								onChange={(e) => {
									const value = e.target.value;
									setProjetoSelecionado({ ...projetoSelecionado, descricao: value });
								}}
								autoSize={{ minRows: 3, maxRows: 12 }}
							/>
						</Card>
					</Col>
					<Col span={8}>
						<Card style={{ border: "none" }}>
							<Title level={5}>Responsável</Title>
							<Select value={responsavel} onChange={handleResponsavelChange} bordered={false} showArrow={false} style={{ display: "block" }}>
								{usuariosCadastrados.map((usuario) => (
									<Option key={usuario} value={usuario}>
										{usuario}
									</Option>
								))}
							</Select>
							<Title level={5}>Criador</Title>
							<p style={{ margin: 0, paddingLeft: 11 }}>{projetoSelecionado?.criador?.nome}</p>
							<Title level={5}>Data Criação</Title>
							<p style={{ margin: 0, paddingLeft: 11 }}>{moment(projetoSelecionado?.criadoEm).format("DD/MM/YYYY")}</p>
						</Card>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col span={16}>
						<Card style={{ border: "none" }}>
							<h4>Comentários</h4>
							<Input.TextArea value={comentario} onChange={handleComentarioChange} onFocus={() => setSaveCommentButtonVisible(true)} placeholder="Escreva um comentário..." autoSize={{ minRows: 1, maxRows: 6 }} />
							{saveCommentButtonVisible && (
								<Space>
									<Button type="primary" style={{ marginTop: "11px" }} onClick={handleComentarioSubmit}>
										Adicionar Comentário
									</Button>
									<Button
										style={{ marginTop: "11px" }}
										onClick={() => {
											setSaveCommentButtonVisible(false);
											setComentario("");
										}}
									>
										Cancelar
									</Button>
								</Space>
							)}
							<List dataSource={comentarios} renderItem={(item) => <List.Item.Meta title={`${item.responsavel} - ${moment(item.criadoEm).format("DD [de] MMMM, YYYY [às] HH:mm")}`}>{item.mensagem}</List.Item.Meta>} />
						</Card>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default KanbanBoard;
