"use client";

import MainLayout from "@/components/MainLayout";
import BoardRegistration from "@/components/quadro/BoardResgistration";

export default function BoardRegistrationPage() {
	return (
		<MainLayout selected="usuarios">
			<BoardRegistration />
		</MainLayout>
	);
}
