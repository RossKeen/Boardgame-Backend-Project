const express = require("express");
const { send400 } = require("./controllers/400");
const { getCategories } = require("./controllers/categories");

const { getUsers } = require("./controllers/users");
const { getReviewById, patchReview } = require("./controllers/reviews");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReview);

app.all("*", send400);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
