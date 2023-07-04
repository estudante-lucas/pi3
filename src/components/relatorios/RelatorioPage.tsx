import ProjetoLog from "@models/ProjetoLog";
import Usuario from "@models/Usuario";
import { Divider, Select, Typography } from "antd";
import { ChartData } from "chart.js/auto";
import moment from "moment";
import { useEffect, useState } from "react";
import ChartComponent from "../Chart";

const { Title } = Typography;
const { Option } = Select;

const RelatoriosPage = () => {
	const [usuarioFiltrado, setUsuarioFiltrado] = useState<number | null>(null);
	const [usuarios, setUsuarios] = useState<Partial<Usuario>[]>([]);

	const [logs, setLogs] = useState<Partial<ProjetoLog>[]>([]);
	const [dadosGrafico, setDadosGrafico] = useState<ChartData>();

	const [tab, setTab] = useState<"TempoMedioConclusaoEtapas" | "TempoTotalPorEtapa" | "CumprimentoPrazos">("TempoMedioConclusaoEtapas");

	const handleFiltroUsuarioChange = (idUsuario: number) => {
		setUsuarioFiltrado(idUsuario);
	};

	useEffect(() => {
		fetch("/api/cadastros/usuarios")
			.then((response) => response.json())
			.then((data) => {
				setUsuarios(data);
			})
			.catch((error) => {
				console.error("Erro ao obter usuários:", error);
			});
	}, []);

	useEffect(() => {
		if (usuarioFiltrado) {
			fetch(`/api/cadastros/projetos-logs?idUsuario=${usuarioFiltrado}`)
				.then((response) => response.json())
				.then((data) => {
					setLogs(data);
				})
				.catch((error) => {
					console.error("Erro ao obter logs de projetos:", error);
				});
		}
	}, [usuarioFiltrado]);

	useEffect(() => {
		if (logs) {
			switch (tab) {
				case "TempoMedioConclusaoEtapas":
					calcularTempoMedioConclusaoEtapas();
					break;

				case "TempoTotalPorEtapa":
					calcularTempoTotalPorEtapa();
					break;

				case "CumprimentoPrazos":
					calcularCumprimentoPrazos();
					break;

				default:
					console.error("Não implementado para este caso!");
					break;
			}
		}
	}, [logs, tab]);

	function onlyUnique(value: any, index: number, array: any[]) {
		return array.indexOf(value) === index;
	}

	const calcularTempoMedioConclusaoEtapas = () => {
		const colunas = ["A Fazer", "Em Progresso", "Em Revisão", "Pronto para Teste", "Aguardando Aprovação", "Concluído"];
		const mediaPorEtapa: any = {};

		const projetos = logs.map((log) => log.projetoId).filter(onlyUnique);

		projetos.forEach((projeto) => {
			const logsPorProjeto = logs.filter((log) => log.projetoId == projeto);
			colunas.forEach((coluna, index) => {
				// Faz nada no último elemento
				if (colunas.length === index + 1) {
					return;
				}

				const colunaAtual = logsPorProjeto.find((log) => log.coluna === coluna);
				const proximaColuna = logsPorProjeto.find((log) => log.coluna === colunas[index + 1]);

				const dataInicial = moment(colunaAtual?.criadoEm);
				const dataFinal = moment(proximaColuna?.criadoEm);

				if (!mediaPorEtapa[coluna]) {
					mediaPorEtapa[coluna] = {};
					mediaPorEtapa[coluna].dias = dataFinal.diff(dataInicial, "days");
					mediaPorEtapa[coluna].contagem = 1;
				} else {
					mediaPorEtapa[coluna].dias += dataFinal.diff(dataInicial, "days");
					mediaPorEtapa[coluna].contagem += 1;
				}
			});
		});

		console.log(mediaPorEtapa);

		if (logs) {
			const dados = {
				labels: colunas,
				datasets: [
					{
						label: "Tempo médio de conclusão (dias)",
						data: colunas.map((coluna) => mediaPorEtapa[coluna]?.dias / mediaPorEtapa[coluna]?.contagem),
						backgroundColor: "blue",
					},
				],
			};

			setDadosGrafico(dados);
		}
	};

	const calcularTempoTotalPorEtapa = () => {};

	const calcularCumprimentoPrazos = () => {};

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

				<Select style={{ width: 200, marginBottom: 16 }} placeholder="Filtrar por usuário" value={usuarioFiltrado?.id} onChange={handleFiltroUsuarioChange}>
					{usuarios.map((usuario) => (
						<Option key={usuario.id} value={usuario.id}>
							{usuario.nome}
						</Option>
					))}
				</Select>

				<div>
					<h1>Tempo médio de conclusão das etapas</h1>
					<ChartComponent data={dadosGrafico} type="line" width="100px" height="100px" />
				</div>
			</div>
		</div>
	);
};

export default RelatoriosPage;
