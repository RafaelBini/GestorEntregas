'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"associados",
			[
				{
					nome_empresa: "Clarice e Raimunda Joalheria Ltda",
					cnpj: '10557209000104',
					senha: "$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC",
					endereco: 'Rua da Convenção, 55562'
				},
				{
					nome_empresa: "Benedito e Manuela Telas Ltda",
					cnpj: '90286052000169',
					senha: "$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC"
				},
				{
					nome_empresa: "Nair e Thomas Alimentos Ltda",
					cnpj: '02545544000164',
					senha: "$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC"
				},
				{
					nome_empresa: "SLuiz e Melissa Entulhos ME",
					cnpj: '59486821000122',
					senha: "$2a$12$JjTtOej1UNtS27HCg.vwmuHZEWD5qZ8QVNoXgfn3SxrGMb9JSnSJC"
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("associados", null, {});
	}
};
