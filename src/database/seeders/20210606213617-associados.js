'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"associados",
			[
				{
					nome_empresa: "Clarice e Raimunda Joalheria Ltda",
					cnpj: '10557209000104',
					senha: "123",
					endereco: 'Rua da Convenção, 55562'
				},
				{
					nome_empresa: "Benedito e Manuela Telas Ltda",
					cnpj: '90286052000169',
					senha: "123"
				},
				{
					nome_empresa: "Nair e Thomas Alimentos Ltda",
					cnpj: '02545544000164',
					senha: "123"
				},
				{
					nome_empresa: "SLuiz e Melissa Entulhos ME",
					cnpj: '59486821000122',
					senha: "123"
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("associados", null, {});
	}
};
