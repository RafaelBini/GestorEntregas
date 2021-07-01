const Associado = require("../models/Associado");
const Sequelize = require("sequelize");

module.exports = {
    async listAllAssociados(req, res) {

        const associados = await Associado.findAll();

        if (associados) {
            res.status(200).json(associados);

        } else
            res.status(404).json({
                msg: "Associado(s) não encontrado(s).",
            });
    },

}