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
            attributes: ['id', 'descricao', 'clienteId', 'motoboyId', 'status', 'valor'],
            include: [{
                attributes: { exclude: ['id', 'cpf', 'associadoId', 'nome', 'senha', 'telefone'] },
                model: Motoboy,
                required: true,
                where: { associadoId: req.associadoId },
            }]
        });

        if (entregas) {
            res.status(200).json(entregas);

        } else {
            res.status(404).json({
                msg: "Entregas n�o encontrada.",
            });
        }
    },
    async listAllEntregasRealizadas(req, res) {
        const entregas = await Entrega.findAll({
            attributes: ['id', 'descricao', 'clienteId', 'motoboyId', 'status', 'valor'],
            include: [{
                attributes: { exclude: ['id', 'cpf', 'associadoId', 'nome', 'senha', 'telefone'] },
                model: Motoboy,
                required: true,
                where: { associadoId: req.associadoId },
            }],
            where: { status: 'REALIZADA' }
        });

        if (entregas) {
            res.status(200).json(entregas);

        } else {
            res.status(404).json({
                msg: "Entregas não encontradas.",
            });
        }
    },
    async listAllEntregasPendentes(req, res) {
        const entregas = await Entrega.findAll({
            attributes: ['id', 'descricao', 'clienteId', 'motoboyId', 'status', 'valor'],
            include: [{
                attributes: { exclude: ['id', 'cpf', 'associadoId', 'nome', 'senha', 'telefone'] },
                model: Motoboy,
                required: true,
                where: { associadoId: req.associadoId },
            }],
            where: { status: 'PENDENTE' }
        });

        if (entregas) {
            res.status(200).json(entregas);

        } else {
            res.status(404).json({
                msg: "Entregas não encontradas.",
            });
        }
    },
    async listEntregasRealizadas(req, res) {
        const entregas = await Entrega.findAll({
            where: {
                status: "REALIZADA",
                motoboyId: req.motoboyId
            }
        });

        if (entregas != "") {
            res.status(200).json(entregas);

        } else {
            res.status(404).json({
                msg: "Entregas não encontradas.",
            });
        }
    },
    async getRelatorioFinMotoboy(req, res) {
        const entregas = await Entrega.findAll({
            where: {
                status: "REALIZADA",
                motoboyId: req.motoboyId
            }
        });

        const total = entregas.reduce((p, c) => {
            return p + parseFloat(c.valor)
        }, 0)

        var info = {
            valorTotal: total,
            minhaPorcentagem: parseFloat((total * 0.7).toFixed(2))
        }

        if (entregas != "") {
            res.status(200).json(info);

        } else {
            res.status(404).json({
                msg: "Entregas não encontradas.",
            });
        }
    },
    async listEntregasPendentes(req, res) {
        const entregas = await Entrega.findAll({
            where: {
                status: "PENDENTE",
                motoboyId: req.motoboyId
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
        const motoboyId = req.params.id;

        console.log(req.associadoId);
        const associadoHaveMotoboy = await Motoboy.findOne({
            where: {
                id: motoboyId,
                associadoId: req.associadoId
            }
        });
        if (!associadoHaveMotoboy) {
            res.status(400).json({ msg: "Motoboy pesquisado nao pertence ao associado logado" });
            return;
        }

        const entregas = await Entrega.findAll({
            where: { motoboyId: motoboyId }
        });

        if (entregas != "") {
            res.status(200).json(entregas);
        } else {
            res.status(404).json({
                msg: "Entregas n�o encontrada para o motoboy: " + motoboyId,
            });
        }
    },
    async createEntrega(req, res) {
        const { descricao, clienteId, motoboyId } = req.body;

        if (!descricao || !clienteId || !motoboyId) {
            res.status(400).json({ msg: "Esta faltando enviar informacao obrigatoria" })
            return;
        }

        const cliente = await Cliente.findOne({
            where: { id: clienteId, associadoId: req.associadoId }
        })

        if (!cliente) {
            res.status(400).json({ msg: "Nenhum cliente com esse ID foi encontrado" })
            return;
        }

        const motoboy = await Motoboy.findOne({
            where: {
                id: motoboyId,
                associadoId: req.associadoId
            }
        })

        if (!motoboy) {
            res.status(400).json({ msg: "Nenhum motoboy com esse ID foi encontrado" })
            return;
        }

        try {
            const status = "PENDENTE";
            await Entrega.create({
                descricao, clienteId, motoboyId, status
            })

            res.json({ msg: "Entrega criada com sucesso!" })
        } catch (error) {
            res.status(500).json({ msg: "Problema ao tentar criar Entrega", msg2: error })
        }
    },
    async update(req, res) {
        const entregaRecebida = req.body;
        const id = req.params.id;
        try {

            if (entregaRecebida.valor && entregaRecebida.valor < 0.0) {
                res.status(400).json({ msg: "Valor nao pode ser menor que zero" })
                return;
            }

            var entregaExists = await Entrega.findOne({
                attributes: ['id', 'descricao', 'clienteId', 'motoboyId', 'status', 'valor'],
                include: [{
                    attributes: { exclude: ['id', 'cpf', 'associadoId', 'nome', 'senha', 'telefone'] },
                    model: Motoboy,
                    required: true,
                    where: { associadoId: req.associadoId, id: req.params.id },
                }]
            });

            if (entregaExists) {

                await Entrega.update(entregaRecebida,
                    { where: { id } },
                );

                res.json({ msg: "Entrega atualizada com sucesso." });

            } else {
                res.status(400).json({ msg: "Nao é possivel alterar uma entrega com id de associado diferente do logado." })
            }
        } catch (error) {
            res.status(500).json({ msg: "Problema ao tentar editar Entrega", msg2: error })
        }

    },
    async realizarEntrega(req, res) {
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
                motoboyId: req.motoboyId
            }
        });
        try {
            if (entrega) {

                if (entrega.status == "PENDENTE") {
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

        const motoboyId = (await entrega).getDataValue("motoboyId");
        console.log(req.associadoId);
        const associadoHaveMotoboy = await Motoboy.findOne({
            where: {
                id: motoboyId,
                associadoId: req.associadoId
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