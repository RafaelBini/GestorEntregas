'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "clientes",
            [
                {
                    nome_empresa: "Entregas Já LTDA",
                    associado_id: 1,
                    cnpj: '56896967000158',
                    endereco: 'Rua Teste, 123'
                },
                {
                    nome_empresa: "Bora Vender SA",
                    associado_id: 2,
                    cnpj: '98865070000107',
                    endereco: 'Rua Aracaiba, 123'
                },
                {
                    nome_empresa: "Aqui Ta Barato LTDA",
                    associado_id: 1,
                    cnpj: '20469046000161',
                    endereco: 'Rua E, 123'
                },
                {
                    nome_empresa: "Comercios Nunes SA",
                    associado_id: 3,
                    cnpj: '24390200000166',
                    endereco: 'Rua do Parque, 976'
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("clientes", null, {});
    }
};
