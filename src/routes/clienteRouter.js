const express = require("express");
const clienteRouter = express.Router();
const clienteController = require("../controllers/clienteController");
const authAssociado = require("../middlewares/authAssociado");

clienteRouter.get("/listAll", authAssociado, clienteController.listAllClientes);
clienteRouter.get("/searchClientByCNPJ/:cnpj", authAssociado, clienteController.searchClientByCNPJ);
clienteRouter.post("/newClient", authAssociado, clienteController.newClient);
clienteRouter.put("/updateClient/:id", authAssociado, clienteController.updateClient);
clienteRouter.delete("/delete/:id", authAssociado, clienteController.deleteClient);

module.exports = clienteRouter;
