"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("projetos", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			nome: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			descricao: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			responsavel: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "usuarios",
					key: "id",
				},
			},
			coluna: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "colunas",
					key: "id",
				},
			},
			criado_em: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			atualizado_em: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			criado_por: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "usuarios",
					key: "id",
				},
			},
			atualizado_por: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "usuarios",
					key: "id",
				},
			},
			apagado_em: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("projetos");
	},
};
