import Coluna from "../../models/Coluna";
import { obterQuadro } from "./QuadroService";

const criarColuna = async (dados: Partial<Coluna>): Promise<Coluna> => {
	if (!dados.nome) throw new Error("O campo nome é obrigatório");
	if (!dados.quadro) throw new Error("O campo quadro é obrigatório");
	
	const quadro = await obterQuadro(dados.quadro);
	if (quadro == null) throw new Error("O quadro não existe");

	const quantidadeColunasNoQuadro = (await obterColunasPorQuadro(quadro.id)).length
	if (!dados.posicao || dados.posicao < quantidadeColunasNoQuadro) {
		dados.posicao = quantidadeColunasNoQuadro
	}

	dados.criadoEm = new Date();
	dados.criadoPor = 1; //TODO Pegar do usuário autenticado na requisição
	try {
		return await Coluna.create(dados);
	} catch (error) {
		console.error("Erro ao criar coluna:", error);
		throw error;
	}
};

const obterColuna = async (id: number): Promise<Coluna | null> => {
	try {
		return await Coluna.findByPk(id);
	} catch (error) {
		console.error("Erro ao obter coluna:", error);
		throw new Error("Erro ao obter coluna");
	}
};

const obterColunasPorQuadro = async (idQuadro: number): Promise<Coluna[]> => {
	try {
		return await Coluna.findAll({ where: { quadro: idQuadro } });
	} catch (error) {
		console.error("Erro ao obter coluna:", error);
		throw new Error("Erro ao obter coluna");
	}
};

const atualizarColuna = async (id: number, dados: any): Promise<Coluna | null> => {
	try {
		await Coluna.update(dados, { where: { id } });
		return await Coluna.findByPk(id);
	} catch (error) {
		console.error("Erro ao atualizar coluna:", error);
		throw new Error("Erro ao atualizar coluna");
	}
};

const excluirColuna = async (id: number): Promise<void> => {
	try {
		const coluna = (await obterColuna(id))!;
		coluna.apagadoEm = new Date();
		await Coluna.update(coluna, { where: { id } });
	} catch (error) {
		console.error("Erro ao excluir coluna:", error);
		throw new Error("Erro ao excluir coluna");
	}
};

const obterTodasColunas = async (): Promise<Coluna[]> => {
	try {
		return await Coluna.findAll({ where: { apagadoEm: null } });
	} catch (error) {
		console.error("Erro ao obter todos os colunas:", error);
		throw new Error("Erro ao obter todos os colunas");
	}
};

export { atualizarColuna, criarColuna, excluirColuna, obterColuna, obterTodasColunas };
