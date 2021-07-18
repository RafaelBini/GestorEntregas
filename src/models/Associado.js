const Sequelize = require("sequelize");

class Associado extends Sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                nomeEmpresa: Sequelize.STRING,
                cnpj: Sequelize.STRING,
                senha: Sequelize.STRING,
                endereco: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Cliente, { foreignKey: "associado_id" });
        this.hasMany(models.Motoboy, { foreignKey: "associado_id" });
    }
}

module.exports = Associado;