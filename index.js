require("dotenv-safe").config();
const express = require("express");
const router = require("./src/routes/router");
const app = express();
require("./src/database");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(process.env.SYSTEM_PORT, () => {
	console.log("Server is running at port ", process.env.SYSTEM_PORT);
});

module.exports = app;
