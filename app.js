const express = require("express");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");

const app = express();

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
