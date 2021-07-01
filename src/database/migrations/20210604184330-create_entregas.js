'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("entregas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "clientes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      motoboy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "motoboys", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("entregas");
  }
};
