const express = require("express");
const { send404 } = require("./controllers/404");
const { getCategories } = require("./controllers/categories");
const { getUsers } = require("./controllers/users");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);

app.all("*", send404);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
