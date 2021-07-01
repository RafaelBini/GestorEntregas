const Sequelize = require("sequelize");

class Motoboy extends Sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                nome: Sequelize.STRING,
                cpf: Sequelize.STRING,
                senha: Sequelize.STRING,
                telefone: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Associado, { foreignKey: "associadoId" });
    }
}

module.exports = Motoboy;