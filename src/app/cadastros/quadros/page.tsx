"use client";

import MainLayout from "@/components/MainLayout";
import BoardList from "@/components/quadro/BoardList";

export default function BoardRegistrationPage() {
	return (
		<MainLayout selected="quadros">
			<BoardList />
		</MainLayout>
	);
}
