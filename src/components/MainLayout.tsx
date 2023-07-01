"use client";
import { Layout } from "antd";
import React, { ReactNode } from "react";
import SideMenu from "./SideMenu";

interface MainLayoutProps {
	children: ReactNode;
	selected: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, selected }) => {
	return (
		<Layout style={{ minHeight: "100vh" }}>
			<SideMenu selected={selected} />
			<Layout>
				<Layout.Content style={{ margin: "16px" }}>{children}</Layout.Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
