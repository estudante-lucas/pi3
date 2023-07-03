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
		<Layout style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}>
			<SideMenu selected={selected} />
			<Layout>
				<Layout.Content style={{ margin: "16px" }}>{children}</Layout.Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
