const express = require("express");
const entregaRouter = express.Router();
const entregaController = require("../controllers/entregaController");
const authAssociado = require("../middlewares/authAssociado");
const authMotoboy = require("../middlewares/authMotoboy");

entregaRouter.post("/create", authAssociado, entregaController.createEntrega);
entregaRouter.get("/listAll", authAssociado, entregaController.listAllEntregas);
entregaRouter.get("/listAllRealizadas", authAssociado, entregaController.listAllEntregasRealizadas);
entregaRouter.get("/listAllPendentes", authAssociado, entregaController.listAllEntregasPendentes);
entregaRouter.get("/listRealizadas", authMotoboy, entregaController.listEntregasRealizadas);
entregaRouter.get("/RelatorioFinMotoboy", authMotoboy, entregaController.getRelatorioFinMotoboy);
entregaRouter.get("/listPendentes", authMotoboy, entregaController.listEntregasPendentes);
entregaRouter.get("/listPorMotoboy/:id", authAssociado, entregaController.listEntregasPorMotoboy);
entregaRouter.put("/update/:id", authAssociado, entregaController.update);
entregaRouter.put("/realizarEntrega/:id", authMotoboy, entregaController.realizarEntrega);
entregaRouter.delete("/delete/:id", authAssociado, entregaController.delete);


module.exports = entregaRouter;