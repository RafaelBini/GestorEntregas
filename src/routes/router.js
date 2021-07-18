const express = require("express");
const associadoRouter = require("./associadoRouter");
const motoboyRouter = require("./motoboyRouter");
const clienteRouter = require("./clienteRouter");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("It's working");
});

router.use("/associado", associadoRouter);
router.use("/motoboy", motoboyRouter);
router.use("/cliente", clienteRouter);


module.exports = router;
