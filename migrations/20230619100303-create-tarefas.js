'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tarefas', {
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
      projeto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projetos',
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

    await queryInterface.addConstraint('tarefas', {
      type: 'foreign key',
      fields: ['criado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'tarefa_criado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('tarefas', {
      type: 'foreign key',
      fields: ['atualizado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'tarefa_atualizado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('tarefas', {
      type: 'foreign key',
      fields: ['responsavel'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'tarefa_responsavel_fk_usuario_id'
    });

    await queryInterface.addConstraint('tarefas', {
      type: 'foreign key',
      fields: ['projeto'],
      references: {
        table: 'projetos',
        field: 'id'
      },
      name: 'tarefa_projeto_fk_projeto_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tarefas');
  }
};
