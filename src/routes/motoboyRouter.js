const express = require("express");
const motoboyRouter = express.Router();
const motoboyController = require("../controllers/motoboyController");
const authAssociado = require("../middlewares/authAssociado");

motoboyRouter.get("/listAll", authAssociado, motoboyController.listAllMotoboys);
motoboyRouter.get("/getByCPF/:cpf", authAssociado, motoboyController.listMotoboyByCPF);
motoboyRouter.delete("/:id", authAssociado, motoboyController.deleteAssoociado);
motoboyRouter.put("/:id", authAssociado, motoboyController.updateMotoboy);
motoboyRouter.post("/create", authAssociado, motoboyController.createMotoboy);
motoboyRouter.post("/auth", motoboyController.authenticateMotoboy);

module.exports = motoboyRouter;
