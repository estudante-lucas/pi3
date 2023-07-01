'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comentarios', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      texto: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tarefa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tarefas',
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

    await queryInterface.addConstraint('comentarios', {
      type: 'foreign key',
      fields: ['criado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'comentario_criado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('comentarios', {
      type: 'foreign key',
      fields: ['atualizado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      name: 'comentario_atualizado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('comentarios', {
      type: 'foreign key',
      fields: ['tarefa'],
      references: {
        table: 'tarefas',
        field: 'id'
      },
      name: 'comentario_tarefa_fk_tarefa_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comentarios');
  }
};
