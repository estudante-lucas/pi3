'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true
      },
      senha: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
        collate: 'utf8mb4_0900_ai_ci'
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: true
      },
      criado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      atualizado_por: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      apagado_em: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuarios');
  }
};
