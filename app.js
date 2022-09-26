const cors = require("cors");
const express = require("express");
const { send400 } = require("./controllers/400");
const { getCategories } = require("./controllers/categories");

const { getUsers } = require("./controllers/users");
const { getReviewById, patchReview, getReviews, getCommentsByReviewId, postComment } = require("./controllers/reviews");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const { deleteComment } = require("./controllers/comments");
const { getEndpoints } = require("./controllers/api");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/categories", getCategories);
app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReview);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", send400);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
