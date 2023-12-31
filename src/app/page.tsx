"use client";

import KanbanBoard from "@/components/KanbanBoard";
import MainLayout from "@/components/MainLayout";

export default function KanbanBoardPage() {
	return (
		<MainLayout selected="dashboard">
			<header>{/* ... */}</header>
			<main>
				<KanbanBoard />
			</main>
			<footer>{/* ... */}</footer>
		</MainLayout>
	);
}
