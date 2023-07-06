"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("autenticacoes", {
			token: {
				type: Sequelize.CHAR(36),
				allowNull: false,
				primaryKey: true,
			},
			usuario: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "usuarios",
					key: "id",
				},
			},
			criado_em: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			mac: {
				type: Sequelize.CHAR(17),
				allowNull: true,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("autenticacoes");
	},
};
