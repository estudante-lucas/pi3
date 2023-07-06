"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("colunas", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			nome: {
				type: Sequelize.STRING(30),
				allowNull: false,
				collate: "utf8mb4_0900_ai_ci",
			},
			quadro: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "quadros",
					key: "id",
				},
			},
			posicao: {
				type: Sequelize.INTEGER,
				allowNull: false,
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
		await queryInterface.dropTable("colunas");
	},
};
