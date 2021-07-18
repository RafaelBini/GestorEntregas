const Sequelize = require("sequelize");

class Cliente extends Sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                nomeEmpresa: Sequelize.STRING,
                cnpj: Sequelize.STRING,
                endereco: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Associado, { foreignKey: "associado_id" });
        this.hasMany(models.Entrega, { foreignKey: "cliente_id" })
    }
}

module.exports = Cliente;