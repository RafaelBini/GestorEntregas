'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "entregas",
            [
                {
                    descricao: "Pizza Grande",
                    cliente_id: 1,
                    motoboy_id: 1,
                    valor: 29.9,
                    status: 'PENDENTE',
                },
                {
                    descricao: "Produto Exemplar",
                    cliente_id: 2,
                    motoboy_id: 2,
                    valor: 10.9,
                    status: 'REALIZADA',
                },
                {
                    descricao: "Aquela Entrega",
                    cliente_id: 3,
                    motoboy_id: 3,
                    valor: 32.9,
                    status: 'REALIZADA',
                },
                {
                    descricao: "Material Exemplar",
                    cliente_id: 3,
                    motoboy_id: 1,
                    valor: 49.9,
                    status: 'PENDENTE',
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("entregas", null, {});
    }
};
