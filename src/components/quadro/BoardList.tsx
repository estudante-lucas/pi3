import Coluna from "@models/Coluna";
import Quadro from "@models/Quadro";
import { Button, Col, Input, Row, Skeleton, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { ExpandableConfig, GetRowKey } from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import React, { Key, useEffect, useState } from "react";

interface QuadroDTO extends Partial<Quadro> {
	Colunas: Coluna[];
}

const QuadroList: React.FC = () => {
	const router = useRouter();

	const [isQuadroListLoading, setIsQuadroListLoading] = useState(false);
	const [isRegisterColumnLoading, setIsRegisterColumnLoading] = useState(false);
	const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
	const [rowsExpanded, setRowExpanded] = useState<readonly Key[]>([]);

	const [boardList, setQuadroList] = useState<QuadroDTO[]>([]);
	const [novaColuna, setNewColumn] = useState<Partial<Coluna> | null>(null);

	const onAdicionarColunaButton = (quadro: any, e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();

		if (quadro.Colunas == null) {
			quadro.Colunas = [];
		}

		const coluna = {
			nome: "",
			quadro: quadro.id!,
			posicao: quadro.Colunas.length,
		};

		quadro.Colunas.push(coluna);
		setNewColumn(coluna);

		setIsAddButtonDisabled(true);

		setRowExpanded([rowKeyQuadro(quadro)]);
	};

	useEffect(() => {
		fetch("/api/cadastros/quadros")
			.then((response) => response.json())
			.then((data) => setQuadroList(data))
			.catch((error) => console.error("Erro ao obter lista de usuários:", error))
			.finally(() => setIsQuadroListLoading(false));
	}, []);

	const colunas: ColumnsType<QuadroDTO> = [
		{
			title: "Nome",
			dataIndex: "nome",
			key: "nome",
		},
		{
			title: "Ações",
			key: "actions",
			align: "right",
			render: (_: string, quadro: QuadroDTO) => {
				return (
					<Button disabled={isAddButtonDisabled} type="primary" onClick={(e) => onAdicionarColunaButton(quadro, e)}>
						Adicionar Coluna
					</Button>
				);
			},
		},
	];

	const expandableConfig: ExpandableConfig<QuadroDTO> = {
		expandedRowKeys: rowsExpanded,
		showExpandColumn: false,
		expandRowByClick: !novaColuna,
		onExpandedRowsChange: (key) => setRowExpanded(key),
		expandedRowRender: (record) => {
			const rowKeyColumn: GetRowKey<Partial<Coluna>> = (record) => "column-" + record.id;
			return (
				<Table
					columns={[
						{
							dataIndex: "nome",
							key: "nome",
							render: (text, record) => (!record.id ? NewColumnComponent() : text),
						},
					]}
					rowKey={rowKeyColumn}
					dataSource={[...record.Colunas]}
					pagination={false}
					locale={{
						emptyText: "As colunas adicionadas serão exibidas aqui!",
					}}
					showHeader={false}
					style={{ borderRadius: 0 }}
				/>
			);
		},
	};

	const NewColumnComponent = () => {
		return (
			<Row gutter={16}>
				<Col span={12}>
					<Input autoFocus disabled={isRegisterColumnLoading} value={novaColuna?.nome} onChange={handleNewColumnInputChange} onPressEnter={() => (novaColuna?.nome ? registerColumn() : null)} onKeyDown={handleInputKeyDown} />
				</Col>
				<Col>
					<Button loading={isRegisterColumnLoading} disabled={!novaColuna?.nome} type="primary" onClick={registerColumn}>
						Adicionar
					</Button>
				</Col>
				<Col>
					<Button loading={isRegisterColumnLoading} type="default" onClick={handleCancelAddColumn}>
						Cancelar
					</Button>
				</Col>
			</Row>
		);
	};

	const handleNewColumnInputChange = (e: any) => {
		const { value } = e.target;
		setNewColumn((prev) => {
			if (prev) {
				return { ...prev, nome: value };
			}
			return null;
		});
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			handleCancelAddColumn();
		}
	};

	const handleCancelAddColumn = () => {
		const quadroId = Number(novaColuna?.quadro);

		setQuadroList((prev) => {
			const updatedQuadroList = prev.map((quadro) => {
				if (quadro.id === quadroId) {
					const updatedColumns = [...quadro.Colunas];
					updatedColumns.pop();
					if (updatedColumns.length === 0) setRowExpanded([]);
					return { ...quadro, Colunas: updatedColumns };
				}
				return quadro;
			});

			return updatedQuadroList;
		});
		setNewColumn(null);
		setIsAddButtonDisabled(false);
	};

	const registerColumn = () => {
		setIsRegisterColumnLoading(true);
		postColumn();
	};

	const postColumn = async () => {
		try {
			const response = await fetch("/api/cadastros/coluna", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(novaColuna),
			});

			if (!response.ok) {
				throw new Error("Erro ao cadastrar coluna");
			}

			const data: Coluna = await response.json();
			message.success("Coluna cadastrada com sucesso!");

			setNewColumn(null);
			setIsAddButtonDisabled(false);

			setQuadroList((prev) => {
				const updatedQuadroList = prev.map((quadro) => {
					if (quadro.id === data.quadro) {
						const updatedColumns = [...quadro.Colunas];
						updatedColumns.pop();
						updatedColumns.push(data);
						return { ...quadro, Colunas: updatedColumns };
					}
					return quadro;
				});

				return updatedQuadroList;
			});
		} catch (error) {
			message.error("Ocorreu um erro! Tente novamente mais tarde.");
			console.error(error);
		} finally {
			setIsRegisterColumnLoading(false);
		}
	};

	const CustomSkeleton = () => (
		<Row gutter={64}>
			<Col span={20}>
				<Skeleton paragraph={false} active />
			</Col>
			<Col span={4}>
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

	const rowKeyQuadro: GetRowKey<QuadroDTO> = (record) => "board-" + record.id;

	return (
		<div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<h1 style={{ marginRight: "16px" }}>Lista de quadros</h1>
				<Button type="primary" onClick={() => router.push("quadro")}>
					Adicionar Quadro
				</Button>
			</div>
			<Table
				loading={isQuadroListLoading}
				dataSource={boardList}
				columns={colunas}
				rowKey={rowKeyQuadro}
				expandable={expandableConfig}
				pagination={{
					hideOnSinglePage: true,
				}}
				locale={{
					emptyText: isQuadroListLoading ? multipleSkeleton() : "Os quadros adicionados serão exibidos aqui!",
				}}
			/>
		</div>
	);
};

export default QuadroList;
