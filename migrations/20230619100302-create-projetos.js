'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projetos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      responsavel: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      coluna: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'colunas',
          key: 'id'
        }
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

    await queryInterface.addConstraint('projetos', {
      type: 'foreign key',
      fields: ['criado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'projeto_criado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('projetos', {
      type: 'foreign key',
      fields: ['atualizado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'projeto_atualizado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('projetos', {
      type: 'foreign key',
      fields: ['responsavel'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'projeto_responsavel_fk_usuario_id'
    });

    await queryInterface.addConstraint('projetos', {
      type: 'foreign key',
      fields: ['coluna'],
      references: {
        table: 'colunas',
        field: 'id'
      },
      name: 'projeto_coluna_fk_coluna_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('projetos');
  }
};
