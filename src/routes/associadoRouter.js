const express = require("express");
const associadoRouter = express.Router();
const associadoController = require("../controllers/associadoController");
const authAssociado = require("../middlewares/authAssociado");

associadoRouter.get("/listAll", associadoController.listAllAssociados);
associadoRouter.get("/relatorioAdm", authAssociado, associadoController.getRelatorioAdministrativo);
associadoRouter.get("/relatorioFin", authAssociado, associadoController.getRelatorioFinanceiro);
associadoRouter.get("/getByCNPJ/:cnpj", associadoController.listAssociadoByCNPJ);
associadoRouter.delete("/:id", associadoController.deleteAssoociado);
associadoRouter.put("/:id", associadoController.updateAssociado);
associadoRouter.post("/create", associadoController.createAssociado);
associadoRouter.post("/auth", associadoController.authenticateAssociado);

module.exports = associadoRouter;
