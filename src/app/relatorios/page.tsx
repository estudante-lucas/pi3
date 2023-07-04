"use client";

import MainLayout from "@/components/MainLayout";
import RelatoriosPage from "@/components/relatorios/RelatorioPage";

export default function UserRegistrationPage() {
	return (
		<MainLayout selected="usuarios">
			<header>{/* ... */}</header>
			<main>
				<RelatoriosPage />
			</main>
			<footer>{/* ... */}</footer>
		</MainLayout>
	);
}
