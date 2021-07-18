const express = require("express");
const associadoRouter = require("./associadoRouter");
const clienteRouter = require("./clienteRouter");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("It's working");
});

router.use("/associado", associadoRouter);
router.use("/cliente", clienteRouter);

module.exports = router;
