import { Card, Col, Row, Typography } from "antd";
import React, { useState } from "react";

const { Title } = Typography;

const KanbanBoard: React.FC = () => {
	const [columns, setColumns] = useState<Column[]>([
		{
			id: 1314,
			title: "A fazer",
			tasks: [
				{
					id: 4234,
					description: "Cliente XPTO",
					title: "Implementação",
					responsavel: "Lucas",
				},
			],
		},
		{
			id: 43234,
			title: "Em andamento",
			tasks: [],
		},
		{
			id: 34534,
			title: "Concluído",
			tasks: [],
		},
	]);

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		taskId: number
	) => {
		e.dataTransfer.setData("taskId", String(taskId));
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		columnId: number
	) => {
		const taskId = Number(e.dataTransfer.getData("taskId"));
		const destinationColumn = columns.find(
			(column) => column.id === columnId
		);
		const sourceColumn = columns.find((column) =>
			column.tasks.some((task) => task.id === taskId)
		);

		if (destinationColumn && sourceColumn) {
			if (destinationColumn.id !== sourceColumn.id) {
				const updatedColumns = addTaskToColumn(
					columns,
					destinationColumn,
					taskId
				);
				removeTaskFromColumn(sourceColumn, taskId);

				setColumns(updatedColumns);
			}
		}
	};

	const addTaskToColumn = (
		columns: Column[],
		destinationColumn: Column,
		taskId: number
	): Column[] => {
		const taskExists = destinationColumn.tasks.find(
			(task) => task.id === taskId
		);
		if (!taskExists) {
			const task: Task = {
				id: taskId,
				title: "Título da tarefa",
				description: "Descrição da tarefa",
				responsavel: "Lucas",
			};
			return columns.map((column) => {
				if (column.id === destinationColumn.id) {
					return {
						...column,
						tasks: [...column.tasks, task],
					};
				}
				return column;
			});
		}
		return columns;
	};

	const removeTaskFromColumn = (column: Column, taskId: number): void => {
		column.tasks = column.tasks.filter((task) => task.id !== taskId);
	};

	return (
		<Row gutter={16}>
			{columns.map((column) => (
				<Col key={column.id} span={8}>
					<Card
						title={<Title level={4}>{column.title}</Title>}
						style={{ marginBottom: "16px" }}
						headStyle={{ backgroundColor: "#f4f4f4" }}
						bodyStyle={{ minHeight: "100px", padding: "8px" }}
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, column.id)}
					>
						{column.tasks.map((task) => (
							<Card
								key={task.id}
								draggable
								onDragStart={(e) => handleDragStart(e, task.id)}
								style={{
									marginBottom: "8px",
									backgroundColor: "#b2b2b2",
								}}
							>
								<Title level={3}>{task.title}</Title>
								<p>{task.description}</p>
								<p style={{ fontSize: "12px" }}>
									{task.responsavel}
								</p>
							</Card>
						))}
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default KanbanBoard;
