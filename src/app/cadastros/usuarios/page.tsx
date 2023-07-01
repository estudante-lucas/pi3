"use client";

import MainLayout from "@/components/MainLayout";
import UsersList from "@/components/usuario/UsersList";

export default function UsersListPage() {
	return (
		<MainLayout selected="usuarios">
			<header>{/* ... */}</header>
			<main>
				<UsersList />
			</main>
			<footer>{/* ... */}</footer>
		</MainLayout>
	);
}
