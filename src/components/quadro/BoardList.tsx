import { Button, Col, Input, Row, Table, message } from "antd";
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
		// Simulação de uma requisição assíncrona para buscar a lista de quadros
		fetchBoardList()
			.then((data) => {
				setBoardList(data);
			})
			.catch((error) => {
				message.error("Erro ao buscar a lista de quadros. Tente novamente mais tarde.");
			})
			.finally(() => {
				setIsBoardListLoading(false);
			});
	}, []);

	const fetchBoardList = () => {
		setIsBoardListLoading(true);
		return new Promise<Board[]>((resolve, reject) => {
			// Simulação de uma requisição assíncrona
			setTimeout(() => {
				// Em caso de sucesso, resolva a Promise com os dados
				resolve([
					{
						id: 1,
						name: "Quadro 1",
						columns: [
							{
								id: 9999,
								title: "Em Andamento",
								board: 1,
								position: 0,
								tasks: [],
							},
							{
								id: 1111,
								title: "PullRequest",
								board: 1,
								position: 1,
								tasks: [],
							},
						],
					},
					{ id: 2, name: "Quadro 2", columns: [] },
					{ id: 3, name: "Quadro 3", columns: [] },
				]);
				// Em caso de erro, rejeite a Promise
				// reject(new Error("Erro ao buscar a lista de quadros."));
			}, 2000);
		});
	};

	const columns: ColumnsType<Board> = [
		{
			title: "Nome",
			dataIndex: "name",
			key: "name",
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
					emptyText: "Os quadros adicionados serão exibidos aqui!",
				}}
			/>
		</div>
	);
};

export default BoardList;
