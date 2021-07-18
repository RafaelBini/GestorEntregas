const express = require("express");
const entregaRouter = express.Router();
const entregaController = require("../controllers/entregaController");
const authAssociado = require("../middlewares/authAssociado");
const authMotoboy = require("../middlewares/authMotoboy");

entregaRouter.post("/create", authAssociado, entregaController.createEntrega);
entregaRouter.get("/listAll", authAssociado, entregaController.listAllEntregas);
entregaRouter.get("/listRealizadas", authMotoboy, entregaController.listEntregasRealizadas);
entregaRouter.get("/listPendentes", authMotoboy, entregaController.listEntregasPendentes);
entregaRouter.get("/listPorMotoboy/:id", authAssociado, entregaController.listEntregasPorMotoboy);
entregaRouter.put("/update/:id", authMotoboy, entregaController.update);
entregaRouter.delete("/delete/:id", authAssociado, entregaController.delete);

module.exports = entregaRouter;