"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("projetos-logs", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			coluna: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			projetoId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "projetos",
					key: "id",
				},
				onUpdate: "NO ACTION",
				onDelete: "NO ACTION",
			},
			criadoPor: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "usuarios",
					key: "id",
				},
				onUpdate: "NO ACTION",
				onDelete: "NO ACTION",
			},
			criadoEm: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("projetos-logs");
	},
};
