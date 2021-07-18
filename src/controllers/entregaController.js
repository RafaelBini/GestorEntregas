const Entrega = require("../models/Entrega");
const Motoboy = require("../models/Motoboy");
const Cliente = require("../models/Cliente");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { DECIMAL, STRING } = require("sequelize");

module.exports = {
    async listAllEntregas(req, res) {
        const entregas = await Entrega.findAll({
            attributes: ['id', 'descricao', 'cliente_id', 'motoboy_id', 'status', 'valor'],
            include: [{
                attributes: { exclude: ['id', 'cpf', 'associado_id', 'nome', 'senha', 'telefone']},
                model: Motoboy,
                required: true,
                where: { associado_id: req.associadoId },
            }]
        });

        if (entregas) {
            res.status(200).json(entregas);

        } else {
            res.status(404).json({
                msg: "Entregas não encontrada.",
            });
        }
    },
    async listEntregasRealizadas(req, res) {
        const entregas = await Entrega.findAll({
            where: {
                status: "REALIZADA",
                motoboy_id: req.motoboyId
            }
        });
        
        if (entregas != "") {
            res.status(200).json(entregas);

        } else {
            res.status(404).json({
                msg: "Entregas não encontrada.",
            });
        }
    },
    async listEntregasPendentes(req, res) {
        const entregas = await Entrega.findAll({
            where: {
                status: "PENDENTE",
                motoboy_id: req.motoboyId
            }
        });
        
        if (entregas != "") {
            res.status(200).json(entregas);

        } else {
            res.status(404).json({
                msg: "Entregas não encontrada.",
            });
        }
    },
    async listEntregasPorMotoboy(req, res) {
        const motoboy_id = req.params.id;

        console.log(req.associado_id);
        const associadoHaveMotoboy = await Motoboy.findOne({
            where: {
                id: motoboy_id,
                associado_id: req.associadoId
            }
        });
        if (!associadoHaveMotoboy) {
            res.status(400).json({ msg: "Motoboy pesquisado nao pertence ao associado logado" });
            return;
        }

        const entregas = await Entrega.findAll({
            where: { motoboy_id: motoboy_id }
        });

        if (entregas!="") {
            res.status(200).json(entregas);
        } else {
            res.status(404).json({
                msg: "Entregas não encontrada para o motoboy: " + motoboy_id,
            });
        }
    },
    async createEntrega(req, res) {
        const { descricao, cliente_id, motoboy_id } = req.body;

        if (!descricao || !cliente_id || !motoboy_id) {
            res.status(400).json({ msg: "Esta faltando enviar informacao obrigatoria" })
            return;
        }

        const cliente = await Cliente.findOne({
            where: { id: cliente_id }
        })

        if (!cliente) {
            res.status(400).json({ msg: "Nenhum cliente com esse ID foi encontrado" })
            return;
        }

        const motoboy = await Motoboy.findOne({
            where: {
                id: motoboy_id,
                associado_id: req.associadoId
            }
        })

        if (!motoboy) {
            res.status(400).json({ msg: "Nenhum motoboy com esse ID foi encontrado" })
            return;
        }

        try {
            const status = "PENDENTE";
            await Entrega.create({
                descricao, cliente_id, motoboy_id, status
            })

            res.json({ msg: "Associado criado com sucesso!" })
        } catch (error) {
            res.status(500).json({ msg: "Problema ao tentar criar Entrega", msg2: error })
        }
    },
    async update(req, res) {
        const { valor } = req.body;
        const id = req.params.id;
        if (!valor || !id) {
            res.status(400).json({ msg: "Esta faltando enviar informacao obrigatoria" })
            return;
        }

        if (valor < 0.0) {
            res.status(400).json({ msg: "Valor nao pode ser menor que zero" })
            return;
        }
        var entrega = await Entrega.findOne({
            where: {
                id,
                motoboy_id: req.motoboyId
            }
        });
        try {
            if (entrega) {
                if (entrega.getDataValue("status") != "PENDENTE") {
                    const status = "REALIZADA";
                    await Entrega.update({
                        status, valor
                    },
                        { where: { id } },
                    );

                    res.json({ msg: "Entrega atualizada com sucesso." });
                } else {
                    res.status(400).json({ msg: "Entrega nao esta pendente." })
                }
            } else {
                res.status(400).json({ msg: "Nao é possivel alterar uma entrega com id de motoboy diferente do logado." })
            }
        } catch (error) {
            res.status(500).json({ msg: "Problema ao tentar editar Entrega", msg2: error })
        }

    },
    async delete(req, res) {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ msg: "Esta faltando enviar informacao obrigatoria" })
            return;
        }

        var entrega = Entrega.findOne({
            where: { id }
        });

        if (!entrega) {
            res.status(400).json({ msg: "Entrega nao encontrada" });
            return;
        }

        const statusEntrega = (await entrega).getDataValue("status");
        if (statusEntrega == "EXCLUIDA") {
            res.status(400).json({ msg: "Entrega ja excluida" });
            return;
        }

        const motoboy_id = (await entrega).getDataValue("motoboy_id");
        console.log(req.associado_id);
        const associadoHaveMotoboy = await Motoboy.findOne({
            where: {
                id: motoboy_id,
                associado_id: req.associadoId
            }
        });
        if (!associadoHaveMotoboy) {
            res.status(400).json({ msg: "Motoboy responsavel nao pertence ao associado logado" });
            return;
        }

        try {
            await Entrega.update(
                { status: "EXCLUIDA" },
                { where: { id } }
            );
            res.json({ msg: "Entrega excluida com sucesso." });
        } catch (error) {
            res.status(500).json({ msg: "Problema ao tentar editar Entrega", msg2: error })
        }

    }

}