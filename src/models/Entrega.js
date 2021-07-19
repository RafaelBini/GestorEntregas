const Sequelize = require("sequelize");

class Entrega extends Sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                descricao: Sequelize.STRING,
                valor: Sequelize.DECIMAL(10, 2),
                status: Sequelize.STRING
            },
            {
                sequelize,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: "clienteId" });
        this.belongsTo(models.Motoboy, { foreignKey: "motoboyId" });
    }
}

module.exports = Entrega;