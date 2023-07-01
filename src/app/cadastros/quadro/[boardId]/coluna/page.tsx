"use client";

import MainLayout from "@/components/MainLayout";
import ColumnRegistration from "@/components/coluna/ColumnRegistration";

export default function ColumnRegistrationPage({ params }: any) {
	return (
		<MainLayout selected="quadros">
			<ColumnRegistration boardId={params.boardId} />
		</MainLayout>
	);
}
