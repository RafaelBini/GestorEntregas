const Cliente = require("../models/Cliente");
const Sequelize = require("sequelize");

module.exports = {
    async newClient(req, res) {

        const { nomeEmpresa, cnpj, endereco } = req.body;

        if (!nomeEmpresa || !cnpj || !endereco) {
            res.status(400).json({
                msg: "Dados obrigatórios não foram preenchidos.",
            });
        }

        const isClientNew = await Cliente.findOne({
            where: { cnpj },
        });

        if (isClientNew)
            res.status(403).json({ msg: "Cliente com esse CNPJ já foi cadastrado." });
        else {
            const cliente = await Cliente.create({
                nomeEmpresa,
                associadoId: req.associadoId,
                cnpj,
                endereco,
            }).catch((error) => {
                console.log("ERRO " + error);
                res.status(500).json({ msg: "Não foi possível inserir os dados." });
            });
            if (cliente)
                res.status(201).json({ msg: "Novo cliente foi adicionado." });
            else
                res
                    .status(404)
                    .json({ msg: "Não foi possível cadastrar novo cliente." });
        }
    },
    async listAllClientes(req, res) {

        const clientes = await Cliente.findAll({
            where: {
                associadoId: req.associadoId
            }
        });

        if (clientes) {
            res.status(200).json(clientes);

        } else
            res.status(404).json({
                msg: "Cliente(s) não encontrado(s).",
            });
    },
    async searchClientByCNPJ(req, res) {
        const cnpj = req.params.cnpj;
        if (!cnpj)
            res.status(400).json({
                msg: "O parâmetro cnpj está vazio.",
            });
        const Op = Sequelize.Op;
        const cliente = await Cliente.findOne({
            where: {
                cnpj: { [Op.like]: "%" + cnpj + "%" },
                associadoId: req.associadoId
            },
        });

        if (cliente) {
            if (cliente == "")
                res.status(404).json({ msg: "Cliente não encontrado" });
            else res.status(200).json(cliente);
        } else
            res.status(404).json({
                msg: "Cliente não encontrado.",
            });
    },
    async updateClient(req, res) {
        const cliente = req.body;
        const clienteID = req.params.id;
        if (!clienteID) return res.status(400).json({ msg: "ID do cliente vazio." });
        else {
            const clientExists = await Cliente.findOne({
                where: {
                    id: clienteID,
                    associadoId: req.associadoId
                }
            });
            if (!clientExists)
                return res.status(404).json({ msg: "Cliente não encontrado." });

            if (cliente.cnpj && cliente.cnpj != clientExists.cnpj) {
                const cpfAlreadyExists = await Cliente.findOne({
                    where: {
                        cnpj: cliente.cnpj,
                        associadoId: req.associadoId
                    }
                })
                if (cpfAlreadyExists) {
                    return res.status(400).json({ msg: "Já existe um outro cliente cadastrado com esse CNPJ!" })

                }
            }

            await Cliente.update(cliente, {
                where: { id: clienteID },
            });
            return res
                .status(200)
                .json({ msg: "Cliente atualizado com sucesso." });


        }
    },
    async deleteClient(req, res) {
        const id = req.params.id

        if (!id) {
            res.status(400).json({
                msg: "Dados obrigatórios não foram preenchidos."
            });
        }

        const clientDelete = await Cliente.destroy({
            where: {
                id: id,
                associadoId: req.associadoId
            },
        }).catch(async (error) => {
            res.status(403).json({ msg: "Erro", msg2: error });
        });

        if (clientDelete <= 0) {
            return res.status(400).json({ msg: "Cliente nao encontrado" })
        }
        res.status(200).json({ msg: "Cliente excluido com sucesso." });
    }

}