'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("clientes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      associado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "associados", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nome_empresa: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
      {
        uniqueKeys: {
          Items_unique: {
            fields: ['associado_id', 'cnpj']
          }
        }
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("clientes");
  }
};
