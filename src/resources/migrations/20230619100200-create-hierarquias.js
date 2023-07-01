'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hierarquias', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
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

    await queryInterface.addConstraint('hierarquias', {
      type: 'foreign key',
      fields: ['atualizado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      name: 'hierarquia_atualizado_por_fk_usuario_id'
    });

    await queryInterface.addConstraint('hierarquias', {
      type: 'foreign key',
      fields: ['criado_por'],
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      name: 'hierarquia_criado_por_fk_usuario_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hierarquias');
  }
};
