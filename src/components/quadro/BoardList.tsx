import { Button, Col, Input, Row, Skeleton, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { ExpandableConfig, GetRowKey } from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import React, { Key, useEffect, useState } from "react";

const BoardList: React.FC = () => {
	const router = useRouter();

	const [isBoardListLoading, setIsBoardListLoading] = useState(false);
	const [isRegisterColumnLoading, setIsRegisterColumnLoading] = useState(false);
	const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
	const [rowsExpanded, setRowExpanded] = useState<readonly Key[]>([]);

	const [boardList, setBoardList] = useState<Board[]>([]);
	const [newColumn, setNewColumn] = useState<Column | null>(null);

	const onAdicionarColunaButton = (board: Board, e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();

		if (board.columns == null) {
			board.columns = [];
		}

		const column = {
			title: "",
			board: board.id!,
			position: board.columns.length,
			tasks: [],
		};

		board.columns.push(column);
		setNewColumn(column);

		setIsAddButtonDisabled(true);

		setRowExpanded([rowKeyBoard(board)]);
	};

	useEffect(() => {
		fetch("/api/cadastros/quadros")
			.then((response) => response.json())
			.then((data) => setBoardList(data))
			.catch((error) => console.error("Erro ao obter lista de usuários:", error))
			.finally(() => setIsBoardListLoading(false));
	}, []);

	const columns: ColumnsType<Board> = [
		{
			title: "Nome",
			dataIndex: "nome",
			key: "nome",
		},
		{
			title: "Ações",
			key: "actions",
			align: "right",
			render: (_: string, board: Board) => {
				return (
					<Button disabled={isAddButtonDisabled} type="primary" onClick={(e) => onAdicionarColunaButton(board, e)}>
						Adicionar Coluna
					</Button>
				);
			},
		},
	];

	const expandableConfig: ExpandableConfig<Board> = {
		expandedRowKeys: rowsExpanded,
		showExpandColumn: false,
		expandRowByClick: !newColumn,
		onExpandedRowsChange: (key) => setRowExpanded(key),
		expandedRowRender: (record) => {
			const rowKeyColumn: GetRowKey<Column> = (record) => "column-" + record.id;
			return (
				<Table
					columns={[
						{
							dataIndex: "title",
							key: "title",
							render: (text, record) => (!record.id ? NewColumnComponent() : text),
						},
					]}
					rowKey={rowKeyColumn}
					dataSource={[...record.columns]}
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
					<Input autoFocus disabled={isRegisterColumnLoading} value={newColumn?.title} onChange={handleNewColumnInputChange} onPressEnter={() => (newColumn?.title ? registerColumn() : null)} onKeyDown={handleInputKeyDown} />
				</Col>
				<Col>
					<Button loading={isRegisterColumnLoading} disabled={!newColumn?.title} type="primary" onClick={registerColumn}>
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
				return { ...prev, title: value };
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
		const boardId = Number(newColumn?.board);

		setBoardList((prev) => {
			const updatedBoardList = prev.map((board) => {
				if (board.id === boardId) {
					const updatedColumns = [...board.columns];
					updatedColumns.pop();
					if (updatedColumns.length === 0) setRowExpanded([]);
					return { ...board, columns: updatedColumns };
				}
				return board;
			});

			return updatedBoardList;
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
				body: JSON.stringify(newColumn),
			});

			if (!response.ok) {
				throw new Error("Erro ao cadastrar coluna");
			}

			const data: Column = await response.json();
			message.success("Coluna cadastrada com sucesso!");

			setNewColumn(null);
			setIsAddButtonDisabled(false);

			setBoardList((prev) => {
				const updatedBoardList = prev.map((board) => {
					if (board.id === data.board) {
						const updatedColumns = [...board.columns];
						updatedColumns.pop();
						updatedColumns.push(data);
						return { ...board, columns: updatedColumns };
					}
					return board;
				});

				return updatedBoardList;
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

	const rowKeyBoard: GetRowKey<Board> = (record) => "board-" + record.id;

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
				loading={isBoardListLoading}
				dataSource={boardList}
				columns={columns}
				rowKey={rowKeyBoard}
				expandable={expandableConfig}
				pagination={{
					hideOnSinglePage: true,
				}}
				locale={{
					emptyText: isBoardListLoading ? multipleSkeleton() : "Os quadros adicionados serão exibidos aqui!",
				}}
			/>
		</div>
	);
};

export default BoardList;
