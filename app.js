const express = require("express");
const { getCategories } = require("./controllers/categories");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");

const app = express();

app.get("/api/categories", getCategories);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
