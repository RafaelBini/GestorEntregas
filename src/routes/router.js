const express = require("express");
const associadoRouter = require("./associadoRouter");
const motoboyRouter = require("./motoboyRouter");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("It's working");
});

router.use("/associado", associadoRouter);
router.use("/motoboy", motoboyRouter);

module.exports = router;
