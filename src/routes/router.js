const express = require("express");
const associadoRouter = require("./associadoRouter");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("It's working");
});

router.use("/associado", associadoRouter);

module.exports = router;
