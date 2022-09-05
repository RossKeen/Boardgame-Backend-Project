const express = require("express");
const { send404 } = require("./controllers/404");
const { getCategories } = require("./controllers/categories");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");

const app = express();

app.get("/api/categories", getCategories);

app.all("*", send404);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
