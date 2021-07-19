const Motoboy = require("../models/Motoboy");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

function passwordValidation(password) {
    if (password.length < 8) return "Senha deve ter no mínimo 8 caracteres.";
    else if (!password.match(/[a-zA-Z]/g))
        return "Senha deve ter no mínimo uma letra.";
    else if (!password.match(/[0-9]+/))
        return "Senha deve ter no mínimo um número.";
    else return "OK";
}

function createToken(id) {
    return jwt.sign({ id, isAssociado: false, isMotoboy: true }, process.env.SECRET, {
        expiresIn: '5h'
    });
}

module.exports = {
    async listAllMotoboys(req, res) {

        const motoboys = await Motoboy.findAll({
            where: {
                associadoId: req.associadoId
            }
        });

        if (motoboys) {
            res.status(200).json(motoboys);

        } else
            res.status(404).json({
                msg: "Motoboy(s) não encontrado(s).",
            });
    },
    async listMotoboyByCPF(req, res) {

        const cpf = req.params.cpf

        if (!cpf) {
            res.status(400).json({ msg: "Necessário informar o CPF" })
            return;
        }

        const motoboy = await Motoboy.findOne({
            where: {
                cpf: cpf,
                associadoId: req.associadoId
            }
        });

        if (motoboy) {
            res.status(200).json(motoboy);

        } else
            res.status(404).json({
                msg: "Motoboy(s) não encontrado(s).",
            });
    },
    async deleteAssoociado(req, res) {

        Motoboy.destroy({
            where: {
                id: req.params.id,
                associadoId: req.associadoId
            }
        }).then((result) => {
            if (result <= 0) {
                return res.status(400).json({ msg: "Nenhum motoboy encontrado com este ID" })
            }
            res.json({ msg: "Motoboy deletado com sucesso" })
        }).catch(() => {
            res.json({ msg: "Prolema ao tentar deletar motoboy" })
        })

    },
    async updateMotoboy(req, res) {
        const motoboy = req.body;

        if (!motoboy) {
            res.status(400).json({ msg: "Nenhuma informação do motoboy foi enviada" })
            return;
        }

        const motoboyExists = await Motoboy.findOne({
            where: {
                id: req.params.id,
                associadoId: req.associadoId
            }
        })

        if (!motoboyExists) {
            res.status(400).json({ msg: "Nenhum motoboy com esse ID foi encontrado" })
            return;
        }

        if (motoboy.cpf && motoboy.cpf != motoboyExists.cpf) {
            const cpfAlreadyExists = await Motoboy.findOne({
                where: {
                    cpf: motoboy.cpf
                }
            })
            if (cpfAlreadyExists) {
                res.status(400).json({ msg: "Já existe um outro motoboy cadastrado com esse CPF!" })
                return;
            }
        }

        Motoboy.update(motoboy, {
            where: {
                id: req.params.id
            }
        });

        res.json({ msg: "Motoboy atualizado com sucesso" })


    },
    async createMotoboy(req, res) {
        const { nome, cpf, senha, telefone } = req.body;

        try {


            if (!nome || !cpf || !senha || !telefone) {
                res.status(400).json({ msg: "Está falatando enviar informação obrigatória" })
                return;
            }

            const passwordValid = passwordValidation(senha);
            if (passwordValid !== "OK")
                return res.status(400).json({ msg: passwordValid });

            const cpfAlreadyExists = await Motoboy.findOne({
                where: {
                    cpf: cpf,
                    associadoId: req.associadoId
                }
            })
            if (cpfAlreadyExists) {
                res.status(400).json({ msg: "Já existe um outro motoboy cadastrado com esse CPF!" })
                return;
            }

            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(senha, salt);

            await Motoboy.create({
                nome, cpf, senha: hash, telefone, associadoId: req.associadoId
            })

            res.json({ msg: "Motoboy criado com sucesso!" })

        }
        catch (error) {
            res.status(500).json({ msg: "Problema ao tentar criar Motoboy", msg2: error })
        }

    },
    async authenticateMotoboy(req, res) {
        const cpf = req.body.cpf;
        const senha = req.body.senha;
        if (!cpf || !senha)
            return res.status(400).json({ msg: "Campos obrigatórios vazios!" });
        try {
            const motoboy = await Motoboy.findOne({
                where: { cpf: cpf },
            });
            if (!motoboy)
                return res.status(404).json({ msg: "Cnpj ou senha inválidos." });
            else {
                if (bcrypt.compareSync(senha, motoboy.senha)) {
                    const id = motoboy.id;
                    const token = createToken(id);
                    return res.status(200)
                        .json({ msg: "Autenticado com sucesso", token });
                } else
                    return res.status(404).json({ msg: "Usuário ou senha inválidos." });
            }
        } catch (error) {
            res.status(500).json({ msg: "Falha ao tentar autenticar motoboy", msg2: error });
        }
    }
}