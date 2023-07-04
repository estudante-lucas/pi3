import ProjetoLog from "../../models/ProjetoLog";

const criar = async (dados: Partial<ProjetoLog>): Promise<ProjetoLog> => {
	if (!dados.coluna) throw new Error("O campo coluna é obrigatório");
	if (!dados.projetoId) throw new Error("O campo projeto é obrigatório");

	dados.criadoEm = new Date();
	dados.criadoPor = 1; //TODO Pegar do usuário autenticado na requisição
	try {
		return await ProjetoLog.create(dados);
	} catch (error) {
		console.error("Erro ao criar projeto:", error);
		throw error;
	}
};

const obterPorId = async (id: number): Promise<ProjetoLog | null> => {
	try {
		return await ProjetoLog.findByPk(id);
	} catch (error) {
		console.error("Erro ao obter projeto:", error);
		throw new Error("Erro ao obter projeto");
	}
};

const obterPorUsuario = async (idUsuario: number): Promise<ProjetoLog[]> => {
	try {
		return await ProjetoLog.findAll({ where: { criadoPor: idUsuario } });
	} catch (error) {
		console.error("Erro ao obter projeto:", error);
		throw new Error("Erro ao obter projeto");
	}
};

const obterTodos = async (): Promise<ProjetoLog[]> => {
	try {
		return await ProjetoLog.findAll({ where: { apagadoEm: null } });
	} catch (error) {
		console.error("Erro ao obter todos os projetos:", error);
		throw new Error("Erro ao obter todos os projetos");
	}
};

const atualizar = async (id: number, dados: any): Promise<ProjetoLog | null> => {
	throw new Error("Não é permitido atualizar logs de projetos.");
};

const excluir = async (id: number): Promise<void> => {
	throw new Error("Não é permitido excluir logs de projetos.");
};

export { atualizar, criar, excluir, obterPorId, obterPorUsuario, obterTodos };
