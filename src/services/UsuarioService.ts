import Usuario from "@models/Usuario";

const criarUsuario = async (dados: Partial<Usuario>): Promise<Usuario> => {
	dados.criadoEm = new Date();
	try {
		const usuario = await Usuario.create(dados);
		return usuario;
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		throw error;
	}
};

const obterUsuario = async (id: number): Promise<Usuario | null> => {
	try {
		const usuario = await Usuario.findByPk(id);
		return usuario;
	} catch (error) {
		console.error("Erro ao obter usuário:", error);
		throw new Error("Erro ao obter usuário");
	}
};

const atualizarUsuario = async (id: number, dados: any): Promise<Usuario | null> => {
	try {
		await Usuario.update(dados, { where: { id } });
		const usuario = await Usuario.findByPk(id);
		return usuario;
	} catch (error) {
		console.error("Erro ao atualizar usuário:", error);
		throw new Error("Erro ao atualizar usuário");
	}
};

const excluirUsuario = async (id: number): Promise<void> => {
	try {
		const usuario = (await obterUsuario(id))!;
		usuario.apagadoEm = new Date();
		await Usuario.update(usuario, { where: { id } });
	} catch (error) {
		console.error("Erro ao excluir usuário:", error);
		throw new Error("Erro ao excluir usuário");
	}
};

const obterTodosUsuarios = async (): Promise<Usuario[]> => {
	try {
		const usuarios = await Usuario.findAll({ where: { apagadoEm: null } });
		return usuarios;
	} catch (error) {
		console.error("Erro ao obter todos os usuários:", error);
		throw new Error("Erro ao obter todos os usuários");
	}
};

export { atualizarUsuario, criarUsuario, excluirUsuario, obterTodosUsuarios, obterUsuario };
