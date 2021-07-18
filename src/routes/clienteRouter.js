const express = require("express");
const clienteRouter = express.Router();
const clienteController = require("../controllers/clienteController");
const auth = require("../middlewares/auth");

clienteRouter.get("/listAll", clienteController.listAllClientes);
clienteRouter.post("/searchClientByCNPJ", clienteController.searchClientByCNPJ);
clienteRouter.post("/newClient", clienteController.newClient);
clienteRouter.put("/updateClient", clienteController.updateClient);
clienteRouter.delete("/delete/:id", clienteController.deleteClient);

module.exports = clienteRouter;
