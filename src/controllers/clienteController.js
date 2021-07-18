const Cliente = require("../models/Cliente");
const Sequelize = require("sequelize");

module.exports = {
    async newClient(req, res) {

        const { nomeEmpresa, associadoId, cnpj, endereco } = req.body;

        if (!nomeEmpresa || !cnpj || !endereco) {
            res.status(400).json({
                msg: "Dados obrigatórios não foram preenchidos.",
            });
        }

        const isClientNew = await Cliente.findOne({
            where: { cnpj },
        });

        if (isClientNew)
            res.status(403).json({ msg: "Cliente já foi cadastrado." });
        else {
            const cliente = await Cliente.create({
                nomeEmpresa,
                associadoId,
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

        const clientes = await Cliente.findAll();

        if (clientes) {
            res.status(200).json(clientes);

        } else
            res.status(404).json({
                msg: "Cliente(s) não encontrado(s).",
            });
    },
    async searchClientByCNPJ(req, res) {
		const cnpj = req.body.cnpj;
		if (!cnpj)
			res.status(400).json({
				msg: "O parâmetro cnpj está vazio.",
			});
		const Op = Sequelize.Op;
		const cliente = await Cliente.findAll({
			where: { cnpj: { [Op.like]: "%" + cnpj + "%" } },
		});
        console.log(cliente);
		if (cliente) {
			if (cliente == "")
				res.status(404).json({ msg: "Cliente não encontrado" });
			else res.status(200).json({ cliente });
		} else
			res.status(404).json({
				msg: "Cliente não encontrado.",
			});
	},
    async updateClient(req, res) {
        const cliente = req.body;
        if (!cliente.id) return res.status(400).json({ msg: "ID do cliente vazio." });
        else {
            const clientExists = await Cliente.findByPk(cliente.id);
            if (!clientExists)
                res.status(404).json({ msg: "Cliente não encontrado." });
            else {
                if (cliente.nome_empresa || cliente.cnpj || cliente.endereco || cliente.associado_id) {
                    await Cliente.update(cliente, {
                        where: { id: cliente.id },
                    });
                    return res
                        .status(200)
                        .json({ msg: "Cliente atualizado com sucesso." });
                } else
                    return res
                        .status(400)
                        .json({ msg: "Campos obrigatórios não preenchidos." });
            }
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
			where: { id: id },
		}).catch(async (error) => {
			res.status(403).json({ msg: "Erro" });
		});
		res.status(200).json({ msg: "Cliente excluido com sucesso."});
    }

}