"use client";

import MainLayout from "@/components/MainLayout";
import BoardEdit from "@/components/quadro/BoardEdit";

export default function BoardEditPage({ params }: any) {
	return (
		<MainLayout selected="quadros">
			<BoardEdit boardId={params.boardId} />
		</MainLayout>
	);
}
