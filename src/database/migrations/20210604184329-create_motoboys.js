'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("motoboys", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      associado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "associados", key: "id" },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
      {
        uniqueKeys: {
          Items_unique: {
            fields: ['associado_id', 'cpf']
          }
        }
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("motoboys");
  }
};
