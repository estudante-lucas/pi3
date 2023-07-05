import ProjetoLog from "@models/ProjetoLog";
import Usuario from "@models/Usuario";
import { Col, Divider, Row, Select, Tabs, TabsProps, Typography } from "antd";
import { ChartData, ChartTypeRegistry } from "chart.js/auto";
import moment from "moment";
import { useEffect, useState } from "react";
import ChartComponent from "../ChartComponent";

const { Title } = Typography;
const { Option } = Select;

const RelatoriosPage = () => {
	const [usuarioFiltrado, setUsuarioFiltrado] = useState<number | null>(null);
	const [usuarios, setUsuarios] = useState<Partial<Usuario>[]>([]);

	const [logs, setLogs] = useState<Partial<ProjetoLog>[]>([]);
	const [dadosGrafico, setDadosGrafico] = useState<ChartData>();

	const [tab, setTab] = useState<"TempoMedioConclusaoEtapas" | "TempoTotalPorEtapa" | "CumprimentoPrazos">("TempoMedioConclusaoEtapas");
	const [tipoGrafico, setTipoGrafico] = useState<keyof ChartTypeRegistry>("line");
	const [colProps, setColProps] = useState({ span: 24, offset: 0 });

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
					console.error(`Não implementado para ${tab}!`);
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

		// Não mostrar a última coluna no gráfico
		colunas.pop();

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

			setColProps({ span: 24, offset: 0 });

			setTipoGrafico("line");
			setDadosGrafico(dados);
		}
	};

	const calcularTempoTotalPorEtapa = () => {
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

		// Não mostrar a última coluna no gráfico
		colunas.pop();

		if (logs) {
			const dados = {
				labels: colunas,
				datasets: [
					{
						label: "Tempo total (dias)",
						data: colunas.map((coluna) => mediaPorEtapa[coluna]?.dias),
						backgroundColor: "blue",
					},
					{
						label: `Projetos finazalidos ${mediaPorEtapa["Aguardando Aprovação"]?.contagem || 0}`,
						data: [],
						backgroundColor: "grey",
					},
				],
			};

			setColProps({ span: 24, offset: 0 });

			setTipoGrafico("line");
			setDadosGrafico(dados);
		}
	};

	const calcularCumprimentoPrazos = () => {
		if (!usuarioFiltrado) return;

		const projetos = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
		const prazo = 48;

		const data = {
			dentroDoPrazo: 0,
			foraDoPrazo: 0,
		};

		for (let i = 0; i < projetos; i++) {
			const numero = Math.floor(Math.random() * (60 - 40 + 1)) + 40;

			if (numero > prazo) {
				data.foraDoPrazo += 1;
			} else {
				data.dentroDoPrazo += 1;
			}
		}

		const dados = {
			labels: ["Dentro do prazo", "Fora do prazo"],
			datasets: [
				{
					data: [data.dentroDoPrazo, data.foraDoPrazo],
					backgroundColor: ["green", "grey"],
					rotation: 180,
				},
			],
		};

		setColProps({ span: 9, offset: 7 });

		setTipoGrafico("pie");
		setDadosGrafico(dados);
	};

	const onChangeTab = (key: any) => {
		setTab(key);
	};

	const items: TabsProps["items"] = [
		{
			key: "TempoMedioConclusaoEtapas",
			label: "Tempo médio de conclusão por etapa",
		},
		{
			key: "TempoTotalPorEtapa",
			label: "Tempo total por etapa",
		},
		{
			key: "CumprimentoPrazos",
			label: "Cumprimento de Prazos",
		},
	];

	return (
		<>
			<Row>
				<Col span={24}>
					<Title level={2}>Relatórios</Title>
					<Divider />
				</Col>
			</Row>
			<Row>
				<Select style={{ width: 200, marginBottom: 16 }} placeholder="Filtrar por usuário" value={usuarioFiltrado} onChange={handleFiltroUsuarioChange}>
					{usuarios.map((usuario) => (
						<Option key={usuario.id} value={usuario.id}>
							{usuario.nome}
						</Option>
					))}
				</Select>
			</Row>
			<Row gutter={16}>
				<Col span={24}>
					<Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} />
				</Col>
			</Row>
			<Row align="middle" gutter={16}>
				<Col span={colProps.span} offset={colProps.offset}>
					<ChartComponent data={dadosGrafico} type={tipoGrafico} width="100px" height="100px" />
				</Col>
			</Row>
		</>
	);
};

export default RelatoriosPage;
