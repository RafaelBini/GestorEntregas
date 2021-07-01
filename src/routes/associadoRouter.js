const express = require("express");
const associadoRouter = express.Router();
const associadoController = require("../controllers/associadoController");
const auth = require("../middlewares/auth");

associadoRouter.get("/listAll", associadoController.listAllAssociados);

module.exports = associadoRouter;
