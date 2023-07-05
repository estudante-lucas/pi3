"use client";

import MainLayout from "@/components/MainLayout";
import UserEdit from "@/components/usuario/UserEdit";

export default function UserEditPage({ params }: any) {
	return (
		<MainLayout selected="usuarios">
			<UserEdit userId={params.userId} />
		</MainLayout>
	);
}
