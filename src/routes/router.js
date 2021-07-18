const express = require("express");
const associadoRouter = require("./associadoRouter");
const motoboyRouter = require("./motoboyRouter");
const clienteRouter = require("./clienteRouter");
const entregaRouter = require("./entregaRouter");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("It's working");
});

router.use("/associado", associadoRouter);
router.use("/motoboy", motoboyRouter);
router.use("/cliente", clienteRouter);
router.use("/entrega", entregaRouter);


module.exports = router;
