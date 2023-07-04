import { BarChartOutlined, ContainerOutlined, DashboardOutlined, TableOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { useRouter } from "next/navigation";
import React from "react";

export interface SideMenuProps {
	selected: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ selected }) => {
	const router = useRouter();
	const { Sider } = Layout;

	const menuItems: ItemType<MenuItemType>[] = [
		{
			key: "dashboard",
			icon: <DashboardOutlined />,
			label: "Kanban",
			onClick: () => {
				router.push("/");
			},
		},
		{
			key: "cadastros",
			icon: <ContainerOutlined />,
			label: "Cadastros",
			children: [
				{
					key: "usuarios",
					icon: <UserOutlined />,
					label: "Usuários",
					onClick: () => {
						router.push("/cadastros/usuarios");
					},
				},
				{
					key: "quadros",
					icon: <TableOutlined />,
					label: "Quadros",
					onClick: () => {
						router.push("/cadastros/quadros");
					},
				},
			],
		},
		{
			key: "relatorios",
			icon: <BarChartOutlined />,
			label: "Relatórios",
			onClick: () => {
				router.push("/relatorios");
			},
		},
	];

	return (
		<Sider width={200} style={{ background: "#fff" }}>
			<Menu mode="inline" defaultSelectedKeys={[selected]} items={menuItems} />
		</Sider>
	);
};

export default SideMenu;
