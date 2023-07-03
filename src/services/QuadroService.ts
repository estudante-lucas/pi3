import Coluna from "@models/Coluna";
import Quadro from "../../models/Quadro";

const criarQuadro = async (dados: Partial<Quadro>): Promise<Quadro> => {
	dados.criadoEm = new Date();
	dados.criadoPor = 1; //TODO Pegar do usuário autenticado na requisição
	try {
		return await Quadro.create(dados);
	} catch (error) {
		console.error("Erro ao criar quadro:", error);
		throw error;
	}
};

const obterQuadro = async (id: number): Promise<Quadro | null> => {
	try {
		return await Quadro.findByPk(id);
	} catch (error) {
		console.error("Erro ao obter quadro:", error);
		throw new Error("Erro ao obter quadro");
	}
};

const atualizarQuadro = async (id: number, dados: any): Promise<Quadro | null> => {
	try {
		await Quadro.update(dados, { where: { id } });
		return await Quadro.findByPk(id);
	} catch (error) {
		console.error("Erro ao atualizar quadro:", error);
		throw new Error("Erro ao atualizar quadro");
	}
};

const excluirQuadro = async (id: number): Promise<void> => {
	try {
		const quadro = (await obterQuadro(id))!;
		quadro.apagadoEm = new Date();
		await Quadro.update(quadro, { where: { id } });
	} catch (error) {
		console.error("Erro ao excluir quadro:", error);
		throw new Error("Erro ao excluir quadro");
	}
};

const obterTodosQuadros = async (): Promise<Quadro[]> => {
	try {
		return await Quadro.findAll({ where: { apagadoEm: null }, include: Coluna });
	} catch (error) {
		console.error("Erro ao obter todos os quadros:", error);
		throw new Error("Erro ao obter todos os quadros");
	}
};

export { atualizarQuadro, criarQuadro, excluirQuadro, obterQuadro, obterTodosQuadros };
