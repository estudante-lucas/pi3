// import { DndContext, DragEndEvent } from "@dnd-kit/core";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
// import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Button, Form, Input, Table, message } from "antd";
// import { ColumnsType } from "antd/es/table";
// import React, { useEffect, useState } from "react";

// export interface ColumnRegistrationProps {
// 	boardId: number;
// }

// interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
// 	"data-row-key": string;
// }

// const ColumnRegistration: React.FC<ColumnRegistrationProps> = ({ boardId }) => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [updateKey, setUpdateKey] = useState(0);

// 	const [board, setBoard] = useState<Board>();
// 	const [columns, setColumns] = useState<Column[]>([]);

// 	const [newColumn, setNewColumn] = useState<Column>({
// 		id: -1,
// 		title: "",
// 		board: boardId,
// 		position: columns.length,
// 		tasks: [],
// 	});

// 	const onTitleChange = (e: any) => {
// 		console.log("onTitleChange");
// 		setUpdateKey((prev) => prev + 1);
// 		setNewColumn({
// 			...newColumn,
// 			title: e.target.value,
// 		});
// 	};

// 	const columnsType: ColumnsType<Column> = [
// 		{
// 			title: "Posição",
// 			dataIndex: "position",
// 		},
// 		{
// 			title: "Título",
// 			dataIndex: "title",
// 		},
// 	];

// 	const handleSubmit = (values: any) => {
// 		setIsLoading(true);

// 		// Simulação de uma requisição assíncrona para cadastrar a nova coluna
// 		createColumn(values)
// 			.then(() => {
// 				message.success("Coluna cadastrada com sucesso!");
// 				// Limpar o formulário após o cadastro
// 				form.resetFields();
// 			})
// 			.catch((error) => {
// 				message.error("Erro ao cadastrar a coluna. Tente novamente mais tarde.");
// 			})
// 			.finally(() => {
// 				setIsLoading(false);
// 			});
// 	};

// 	const createColumn = (columnData: any) => {
// 		// Implemente aqui a lógica para cadastrar a nova coluna
// 		return new Promise<void>((resolve, reject) => {
// 			// Simulação de uma requisição assíncrona
// 			setTimeout(() => {
// 				// Em caso de sucesso, resolva a Promise
// 				resolve();
// 				// Em caso de erro, rejeite a Promise
// 				// reject(new Error("Erro ao cadastrar a coluna."));
// 			}, 2000);
// 		});
// 	};

// 	useEffect(() => {
// 		fetchBoard()
// 			.then((board) => {
// 				setBoard(board);
// 				newColumn.position = board.columns.length;
// 				board.columns.push(newColumn);
// 				setColumns(board.columns);
// 			})
// 			.catch((error) => {
// 				message.error("Erro ao buscar os dados do quadro. Tente novamente mais tarde.");
// 			});
// 	}, [boardId]);

// 	const fetchBoard = async () => {
// 		const response = await fetch(`/api/cadastros/quadro/${boardId}`);
// 		const data: Board = await response.json();
// 		return data;
// 	};

// 	const [form] = Form.useForm();

// 	const onDragEnd = ({ active, over }: DragEndEvent) => {
// 		if (active.id !== over?.id) {
// 			setColumns((prev) => {
// 				const activeIndex = prev.findIndex((column) => column.id === active.id);
// 				const overIndex = prev.findIndex((column) => column.id === over?.id);
// 				return arrayMove(prev, activeIndex, overIndex);
// 			});
// 		}
// 	};

// 	const Row = (props: RowProps) => {
// 		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
// 			id: props["data-row-key"],
// 		});

// 		const style: React.CSSProperties = {
// 			...props.style,
// 			transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
// 			transition,
// 			cursor: "move",
// 			...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
// 		};

// 		return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
// 	};

// 	return (
// 		<div>
// 			<h1>Cadastrar coluna no quadro {board?.name}</h1>

// 			<Form form={form} onFinish={handleSubmit} layout="vertical">
// 				<Form.Item label="Título" name="title" rules={[{ required: true, message: "Por favor, insira o nome da coluna." }]}>
// 					<Input value={newColumn.title} onChange={onTitleChange} />
// 				</Form.Item>

// 				<DndContext key={updateKey} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
// 					<SortableContext items={columns.map((column) => column.id)} strategy={verticalListSortingStrategy}>
// 						<Table
// 							components={{
// 								body: {
// 									row: Row,
// 								},
// 							}}
// 							rowKey="id"
// 							columns={columnsType}
// 							dataSource={columns}
// 						/>
// 					</SortableContext>
// 				</DndContext>

// 				<Form.Item>
// 					<Button type="primary" htmlType="submit" loading={isLoading}>
// 						Cadastrar
// 					</Button>
// 				</Form.Item>
// 			</Form>
// 		</div>
// 	);
// };

// export default ColumnRegistration;

// import { DndContext, useSensor, useSensors } from "@dnd-kit/core";
// import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
// import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Button, Form, Input, Table } from "antd";
// import { ColumnsType } from "antd/es/table";
// import React, { useState } from "react";

// export interface ColumnRegistrationProps {
// 	boardId: number;
// }

// interface ColumnProps extends React.HTMLAttributes<HTMLTableHeaderCellElement> {
// 	"data-column-key": string;
// }

// const ColumnRegistration: React.FC<ColumnRegistrationProps> = ({ boardId }) => {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [board, setBoard] = useState<Board>();
// 	const [columns, setColumns] = useState<Column[]>([]);
// 	const [newColumn, setNewColumn] = useState<Column>({
// 		id: -1,
// 		title: "",
// 		board: boardId,
// 		position: columns.length,
// 		tasks: [],
// 	});

// 	const [updateKey, setUpdateKey] = useState(0); // Chave de atualização para o DndContext

// 	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const { value } = e.target;
// 		setNewColumn((prevColumn) => ({
// 			...prevColumn,
// 			title: value,
// 		}));
// 	};

// 	const columnsType: ColumnsType<Column> = [
// 		{
// 			title: "Posição",
// 			dataIndex: "position",
// 			width: 100,
// 			render: (_, column) => {
// 				const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
// 					id: column.id.toString(),
// 				});

// 				const style: React.CSSProperties = {
// 					transform: CSS.Transform.toString(transform),
// 					transition,
// 					cursor: "move",
// 					...(isDragging ? { zIndex: 9999 } : {}),
// 				};

// 				return (
// 					<th {...attributes} {...listeners} ref={setNodeRef} style={style} data-column-key={column.id}>
// 						{column.position}
// 					</th>
// 				);
// 			},
// 		},
// 		{
// 			title: "Título",
// 			dataIndex: "title",
// 			render: (_, column) => {
// 				return <span>{column.title}</span>;
// 			},
// 		},
// 	];

// 	const [form] = Form.useForm();

// 	// Restante do código...

// 	const resetDndContext = () => {
// 		setUpdateKey((prevKey) => prevKey + 1); // Atualiza a chave de atualização para recriar o DndContext
// 	};

// 	return (
// 		<div>
// 			<h1>Cadastrar coluna no quadro {board?.name}</h1>

// 			<Form form={form} onFinish={handleSubmit} layout="vertical">
// 				<Form.Item label="Título" name="title" rules={[{ required: true, message: "Por favor, insira o nome da coluna." }]}>
// 					<Input value={newColumn.title} onChange={onTitleChange} />
// 				</Form.Item>

// 				<Button type="primary" onClick={resetDndContext}>
// 					Resetar DndContext
// 				</Button>

// 				<DndContext
// 					sensors={useSensors(useSensor)}
// 					modifiers={[restrictToHorizontalAxis]}
// 					collisionDetection={closestCenter}
// 					onDragEnd={onDragEnd}
// 					key={updateKey} // Chave de atualização para recriar o DndContext
// 				>
// 					<SortableContext items={columns.map((column) => column.id.toString())} strategy={horizontalListSortingStrategy}>
// 						<Table columns={columnsType} dataSource={columns} pagination={false} showHeader={false} />
// 					</SortableContext>
// 				</DndContext>

// 				<Form.Item>
// 					<Button type="primary" htmlType="submit" loading={isLoading}>
// 						Cadastrar
// 					</Button>
// 				</Form.Item>
// 			</Form>
// 		</div>
// 	);
// };

// export default ColumnRegistration;
