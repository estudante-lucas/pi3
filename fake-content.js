const moment = require("moment");

const projetos = [
	{ id: 1, nome: "Otimização de processos internos" },
	{ id: 2, nome: "Estratégia de marketing digital" },
	{ id: 3, nome: "Desenvolvimento de treinamentos corporativos" },
	{ id: 4, nome: "Implementação de sistema de gestão empresarial" },
	{ id: 5, nome: "Análise e melhoria de experiência do cliente" },
	{ id: 6, nome: "Expansão de mercado e prospecção de novos clientes" },
	{ id: 7, nome: "Reestruturação organizacional e mudança cultural" },
];

const usuarios = [
	{ id: 1, nome: "Lucas" },
	{ id: 2, nome: "Maria" },
	{ id: 3, nome: "João" },
];

const colunas = ["A Fazer", "Em Progresso", "Em Revisão", "Pronto para Teste", "Aguardando Aprovação", "Concluído"];

function generateRandomDate(start, end, minDuration, maxDuration) {
	const startDate = moment(start);
	const endDate = moment(end);
	const duration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration; // Gerar uma duração aleatória entre minDuration e maxDuration
	const randomDiff = Math.floor(Math.random() * (duration + 1));
	return startDate.add(randomDiff, "days");
}

const inserts = [];

projetos.forEach((projeto) => {
	const projetoId = projeto.id;
	const registrosProjeto = [];

	let currentDate = moment().year(2023).month(3).date(1); // Iniciar em 01/04

	colunas.forEach((coluna) => {
		const criadoPor = usuarios[projetoId % usuarios.length].id;
		let minDuration, maxDuration;
		if (coluna === "Em Revisão" || coluna === "Pronto para Teste" || coluna === "Aguardando Aprovação") {
			minDuration = 8;
			maxDuration = 14;
		} else if (coluna === "A Fazer") {
			minDuration = 1;
			maxDuration = 58;
		} else {
			minDuration = 3;
			maxDuration = 5;
		}
		const criadoEm = generateRandomDate(currentDate, currentDate, minDuration, maxDuration);

		// Definir a hora entre 08:00 e 18:00
		const hour = Math.floor(Math.random() * 11) + 8;
		const minutes = Math.floor(Math.random() * 60);
		const seconds = Math.floor(Math.random() * 60);

		criadoEm.hour(hour).minute(minutes).second(seconds);

		const insertStatement = `INSERT INTO \`projetos-logs\` (coluna, projetoId, criadoPor, criadoEm) VALUES ('${coluna}', ${projetoId}, ${criadoPor}, '${criadoEm.format("YYYY-MM-DD HH:mm:ss")}');`;
		registrosProjeto.push(insertStatement);

		// Avançar para a próxima data
		const duration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration; // Gerar uma duração aleatória entre minDuration e maxDuration
		currentDate.add(duration, "days");
	});

	inserts.push({ projetoNome: projeto.nome, registrosProjeto });
});

inserts.forEach((item) => {
	item.registrosProjeto.forEach((registro) => {
		console.log(registro);
	});
});
