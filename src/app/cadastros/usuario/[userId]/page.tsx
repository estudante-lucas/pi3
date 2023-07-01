"use client";

import MainLayout from "@/components/MainLayout";
import UserEdit from "@/components/usuario/UserEdit";

export interface UserEditResponse {
	user: User;
	notFound: boolean;
}

export default function UserEditPage({ params }: any) {
	return (
		<MainLayout selected="usuarios">
			<UserEdit userId={params.userId} />
		</MainLayout>
	);
}
