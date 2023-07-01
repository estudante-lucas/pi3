"use client";

import MainLayout from "@/components/MainLayout";
import UserRegistration from "@/components/usuario/UserRegistration";

export default function UserRegistrationPage() {
	return (
		<MainLayout selected="usuarios">
			<header>{/* ... */}</header>
			<main>
				<UserRegistration />
			</main>
			<footer>{/* ... */}</footer>
		</MainLayout>
	);
}
