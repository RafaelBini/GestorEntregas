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
        this.belongsTo(models.Cliente, { foreignKey: "cliente_id" });
        this.belongsTo(models.Motoboy, { foreignKey: "motoboy_id" });
    }
}

module.exports = Entrega;