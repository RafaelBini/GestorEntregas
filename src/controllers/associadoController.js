const Associado = require("../models/Associado");
const Motoboy = require("../models/Motoboy");
const Entrega = require("../models/Entrega");
const Cliente = require("../models/Cliente");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { DECIMAL } = require("sequelize");

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

function passwordValidation(password) {
    if (password.length < 8) return "Senha deve ter no mínimo 8 caracteres.";
    else if (!password.match(/[a-zA-Z]/g))
        return "Senha deve ter no mínimo uma letra.";
    else if (!password.match(/[0-9]+/))
        return "Senha deve ter no mínimo um número.";
    else return "OK";
}

function createToken(id) {
    return jwt.sign({ id, isAssociado: true, isMotoboy: false }, process.env.SECRET, {
        expiresIn: '5h'
    });
}

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
    async listAssociadoByCNPJ(req, res) {

        const cnpj = req.params.cnpj

        if (!cnpj) {
            res.status(400).json({ msg: "Necessário informar o CNPJ" })
            return;
        }

        const associados = await Associado.findAll({
            where: {
                cnpj: cnpj
            }
        });

        if (associados) {
            res.status(200).json(associados);

        } else
            res.status(404).json({
                msg: "Associado(s) não encontrado(s).",
            });
    },
    async deleteAssoociado(req, res) {
        Associado.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.json({ msg: "Associado deletado com sucesso" })
        }).catch(() => {
            res.json({ msg: "Prolema ao tentar deletar associado" })
        })

    },
    async updateAssociado(req, res) {
        const associado = req.body;

        if (!associado) {
            res.status(400).json({ msg: "Nenhuma informação do associado foi enviada" })
            return;
        }

        const associadoExists = await Associado.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!associadoExists) {
            res.status(400).json({ msg: "Nenhum associado com esse ID foi encontrado" })
            return;
        }

        if (associado.cnpj && associado.cnpj != associadoExists.cnpj) {
            const cnpjAlreadyExists = await Associado.findOne({
                where: {
                    cnpj: associado.cnpj
                }
            })
            if (cnpjAlreadyExists) {
                res.status(400).json({ msg: "Já existe um outro associado cadastrado com esse CNPJ!" })
                return;
            }
        }

        if (associado.senha) {
            const passwordValid = passwordValidation(associado.senha);
            if (passwordValid !== "OK")
                return res.status(400).json({ msg: passwordValid });
            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(associado.senha, salt);
            associado.senha = hash;
        }

        Associado.update(associado, {
            where: {
                id: req.params.id
            }
        });

        res.json({ msg: "Associado atualizado com sucesso" })


    },
    async createAssociado(req, res) {
        const { nomeEmpresa, cnpj, senha, endereco } = req.body;

        try {


            if (!nomeEmpresa || !cnpj || !senha) {
                res.status(400).json({ msg: "Está falatando enviar informação obrigatória" })
                return;
            }

            const passwordValid = passwordValidation(senha);
            if (passwordValid !== "OK")
                return res.status(400).json({ msg: passwordValid });

            const cnpjAlreadyExists = await Associado.findOne({
                where: {
                    cnpj: cnpj
                }
            })
            if (cnpjAlreadyExists) {
                res.status(400).json({ msg: "Já existe um outro associado cadastrado com esse CNPJ!" })
                return;
            }

            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(senha, salt);

            await Associado.create({
                nomeEmpresa, cnpj, senha: hash, endereco
            })

            res.json({ msg: "Associado criado com sucesso!" })

        }
        catch (error) {
            res.status(500).json({ msg: "Problema ao tentar criar Associado", msg2: error })
        }

    },
    async authenticateAssociado(req, res) {
        const cnpj = req.body.cnpj;
        const senha = req.body.senha;
        if (!cnpj || !senha)
            return res.status(400).json({ msg: "Campos obrigatórios vazios!" });
        try {
            const associado = await Associado.findOne({
                where: { cnpj: cnpj },
            });
            if (!associado)
                return res.status(404).json({ msg: "Cnpj ou senha inválidos." });
            else {
                if (bcrypt.compareSync(senha, associado.senha)) {
                    const id = associado.id;
                    const token = createToken(id);
                    return res.status(200)
                        .json({ msg: "Autenticado com sucesso", token });
                } else
                    return res.status(404).json({ msg: "Usuário ou senha inválidos." });
            }
        } catch (error) {
            res.status(500).json({ msg: "Falha ao tentar autenticar associado", msg2: error });
        }
    },
    async getRelatorioAdministrativo(req, res) {
        const associado = await Associado.findOne({
            where: {
                id: req.associadoId
            },
            include: [{
                model: Motoboy,
                include: [Entrega]
            }, {
                model: Cliente,
                include: [Entrega]
            }]

        })

        const todasEntregas = associado.Motoboys.reduce((prev, current) => {
            return [
                ...prev,
                ...current.Entregas
            ]
        }, []);

        var info = {
            totalClientes: associado.Clientes.length,
            totalMotoboys: associado.Motoboys.length,
            totalEntregas: todasEntregas.length,
            entregasRealizadas: `${Math.round((todasEntregas.filter(e => e.status == "REALIZADA").length / todasEntregas.length) * 100)} %`,
            entregasPendentes: `${Math.round((todasEntregas.filter(e => e.status == "PENDENTE").length / todasEntregas.length) * 100)} %`,
            topClientesMaisEntregas: associado.Clientes.sort((a, b) => {
                return b.Entregas.length - a.Entregas.length
            }).map(c => {
                return {
                    clienteNome: c.nomeEmpresa,
                    clienteCNPJ: c.cnpj,
                    clienteId: c.id,
                    numEntregas: c.Entregas.length
                }
            }).splice(0, 5),
            topMotoboysMaisEntregas: associado.Motoboys.sort((a, b) => {
                return b.Entregas.length - a.Entregas.length
            }).map(m => {
                return {
                    motoboyNome: m.nome,
                    motoboyCNPJ: m.cpf,
                    motoboyId: m.id,
                    numEntregas: m.Entregas.length
                }
            }).splice(0, 5)

        }

        res.json(info)

    },
    async getRelatorioFinanceiro(req, res) {
        const associado = await Associado.findOne({
            where: {
                id: req.associadoId
            },
            include: [{
                model: Motoboy,
                include: [Entrega]
            }, {
                model: Cliente,
                include: [Entrega]
            }]

        })

        const totalEntregas = associado.Motoboys.reduce((prev, curr) => {
            return ((prev + curr.Entregas.reduce((prev, curr) => prev + Number(curr.valor), 0))).round(2)
        }, 0);

        var info = {
            totalEntregas,
            parteMotoboys: (totalEntregas * 0.7).round(2),
            parteAssociado: (totalEntregas * 0.3).round(2),
        }

        res.json(info)

    },
    async getMyAssociadoInfo(req, res) {

        const associado = await Associado.findOne({
            where: {
                id: req.associadoId
            }
        });

        if (associado) {
            res.status(200).json(associado);

        } else
            res.status(404).json({
                msg: "Associado(s) não encontrado(s).",
            });
    },
    async changePassword(req, res) {
        const { newPassword } = req.body;
        console.log(newPassword)

        try {

            if (!newPassword) {
                return res.status(400).json({ msg: "Nenhuma nova senha (newPassword) informada" })
            }

            const passwordValid = passwordValidation(newPassword);
            if (passwordValid !== "OK")
                return res.status(400).json({ msg: passwordValid });

            const associadoExists = await Associado.findOne({
                where: {
                    id: req.associadoId
                }
            })

            if (!associadoExists) {
                res.status(400).json({ msg: "Nenhum associado com esse ID foi encontrado" })
                return;
            }

            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(newPassword, salt);

            await Associado.update({
                senha: hash
            }, {
                where: {
                    id: req.associadoId
                }
            });

            res.json({ msg: "Senha alterada com sucesso" })

        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ msg: 'Erro ao tentar atualizar informação no banco de dados', msg2: error })
        }
    },
}