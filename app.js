const express = require("express");
const { send400 } = require("./controllers/400");
const { getCategories } = require("./controllers/categories");
const { getReviewById } = require("./controllers/reviews");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("*", send400);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
