'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('colunas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING(30),
        allowNull: false,
        collate: 'utf8mb4_0900_ai_ci'
      },
      quadro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quadros',
          key: 'id'
        }
      },
      posicao: {
        type: Sequelize.INTEGER,
        allowNull: false
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
        allowNull: false,
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

    await queryInterface.addConstraint('colunas', {
      type: 'foreign key',
      fields: ['criado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'lista_criado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('colunas', {
      type: 'foreign key',
      fields: ['atualizado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'lista_atualizado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('colunas', {
      type: 'foreign key',
      fields: ['quadro'],
      references: {
        table: 'quadros',
        field: 'id'
      },
      name: 'lista_quadro_fk_quadro_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('colunas');
  }
};
