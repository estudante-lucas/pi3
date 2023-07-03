import Projeto from "../../models/Projeto";

const criarProjeto = async (dados: Partial<Projeto>): Promise<Projeto> => {
	if (!dados.nome) throw new Error("O campo nome é obrigatório");
	if (!dados.coluna) throw new Error("O campo coluna é obrigatório");

	dados.criadoEm = new Date();
	dados.criadoPor = 1; //TODO Pegar do usuário autenticado na requisição
	try {
		return await Projeto.create(dados);
	} catch (error) {
		console.error("Erro ao criar projeto:", error);
		throw error;
	}
};

const obterProjeto = async (id: number): Promise<Projeto | null> => {
	try {
		return await Projeto.findByPk(id);
	} catch (error) {
		console.error("Erro ao obter projeto:", error);
		throw new Error("Erro ao obter projeto");
	}
};

const obterProjetosPorColuna = async (idColuna: number): Promise<Projeto[]> => {
	try {
		return await Projeto.findAll({ where: { coluna: idColuna } });
	} catch (error) {
		console.error("Erro ao obter projeto:", error);
		throw new Error("Erro ao obter projeto");
	}
};

const atualizarProjeto = async (id: number, dados: any): Promise<Projeto | null> => {
	try {
		await Projeto.update(dados, { where: { id } });
		return await Projeto.findByPk(id);
	} catch (error) {
		console.error("Erro ao atualizar projeto:", error);
		throw new Error("Erro ao atualizar projeto");
	}
};

const excluirProjeto = async (id: number): Promise<void> => {
	try {
		const projeto = (await obterProjeto(id))!;
		projeto.apagadoEm = new Date();
		await Projeto.update(projeto, { where: { id } });
	} catch (error) {
		console.error("Erro ao excluir projeto:", error);
		throw new Error("Erro ao excluir projeto");
	}
};

const obterTodasProjetos = async (): Promise<Projeto[]> => {
	try {
		return await Projeto.findAll({ where: { apagadoEm: null } });
	} catch (error) {
		console.error("Erro ao obter todos os projetos:", error);
		throw new Error("Erro ao obter todos os projetos");
	}
};

export { atualizarProjeto, criarProjeto, excluirProjeto, obterProjeto, obterTodasProjetos };
