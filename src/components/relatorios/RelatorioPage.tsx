import Usuario from "@models/Usuario";
import { Divider, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import ChartComponent from "../Chart";

const { Title } = Typography;
const { Option } = Select;

const RelatoriosPage = () => {
	const [usuarioFiltrado, setUsuarioFiltrado] = useState<Partial<Usuario> | null>(null);
	const [usuarios, setUsuarios] = useState<Partial<Usuario>[]>([]);

	const handleFiltroUsuarioChange = (usuario: Partial<Usuario>) => {
		setUsuarioFiltrado(usuario);
	};

	useEffect(() => {
		fetch("/api/cadastros/usuarios")
			.then((response) => response.json())
			.then((data) => {
				setUsuarios(data);
				setUsuarioFiltrado(data[0]);
			})
			.catch((error) => {
				console.error("Erro ao obter usuários:", error);
			});
	}, []);

	const averageTimeData = {
		labels: ["A Fazer", "Em Progresso", "Em Revisão", "Pronto para Teste", "Aguardando Aprovação", "Concluído"],
		datasets: [
			{
				label: "Tempo médio de conclusão (dias)",
				data: [5, 7, 10, 8, 12, 15],
				backgroundColor: "blue",
			},
		],
	};

	return (
		<div>
			<div style={{ padding: "24px" }}>
				<Title level={2}>Relatórios</Title>
				<Divider />

				<Select style={{ width: 200, marginBottom: 16 }} placeholder="Filtrar por usuário" value={usuarioFiltrado} onChange={handleFiltroUsuarioChange}>
					{usuarios.map((usuario) => (
						<Option key={usuario.id} value={usuario.id}>
							{usuario.nome}
						</Option>
					))}
				</Select>

				<div>
					<h1>Tempo médio de conclusão das etapas</h1>
					<ChartComponent data={averageTimeData} type="line" width="100px" height="100px" />
				</div>
			</div>
		</div>
	);
};

export default RelatoriosPage;
