'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "motoboys",
            [
                {
                    nome: "Anderson Nunes",
                    associado_id: 1,
                    cpf: '12245230086',
                    telefone: '41982765826',
                    senha: '$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC'
                },
                {
                    nome: "Jodano Monzo",
                    associado_id: 2,
                    cpf: '33856297057',
                    telefone: '41928765826',
                    senha: '$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC'
                },
                {
                    nome: "Motoboison Neves",
                    associado_id: 1,
                    cpf: '30430131070',
                    telefone: '41988725826',
                    senha: '$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC'
                },
                {
                    nome: "Luis Antonio Moto",
                    associado_id: 2,
                    cpf: '73729306006',
                    telefone: '41988265826',
                    senha: '$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC'
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("motoboys", null, {});
    }
};
