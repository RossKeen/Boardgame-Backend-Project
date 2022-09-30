const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
      FROM reviews 
      LEFT JOIN comments 
      ON reviews.review_id = comments.review_id 
      WHERE reviews.review_id = $1 
      GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "No review exists with that ID" });
      }
      rows[0].comment_count = parseInt(rows[0].comment_count);
      return rows[0];
    });
};

exports.updateReview = (review_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query("SELECT votes FROM reviews WHERE review_id = $1", [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No review exists with that ID" });
      } else {
        const currentVotes = rows[0].votes;
        return db.query("UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *", [currentVotes + inc_votes, review_id]);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectReviews = (category, order = "DESC", sort_by = "created_at") => {
  return db
    .query("SELECT slug FROM categories;")
    .then(({ rows }) => {
      const categoriesArr = [];
      rows.forEach((category) => {
        categoriesArr.push(category.slug);
      });
      const queryValues = [];
      let queryStr = `SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`;
      if (category) {
        if (!categoriesArr.includes(category)) {
          return Promise.reject({ status: 400, msg: "Invalid category query" });
        } else {
          queryValues.push(category);
          queryStr += ` WHERE category = $1`;
        }
      }
      if (!["asc", "desc", "ASC", "DESC"].includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
      }
      if (!["review_id", "title", "review_body", "designer", "review_img_url", "votes", "category", "owner", "created_at", "comment_count"].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
      }
      queryStr += ` GROUP BY reviews.review_id, reviews.created_at ORDER BY ${sort_by} ${order};`;

      return db.query(queryStr, queryValues);
    })
    .then(({ rows }) => {
      rows.forEach((review) => {
        review.comment_count = parseInt(review.comment_count);
      });
      return rows;
    });
};

exports.selectCommentsByReviewId = (review_id) => {
  return db
    .query("SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;", [review_id])
    .then(({ rows }) => {
      if (rows.length) {
        return rows;
      } else {
        return db.query("SELECT * FROM reviews WHERE review_id = $1;", [review_id]);
      }
    })
    .then((rows) => {
      if (Array.isArray(rows) === true) {
        return rows;
      }
      if (rows.rows.length) {
        return [];
      }
      return Promise.reject({ status: 404, msg: "No review exists with that ID" });
    });
};

exports.addComment = (review_id, newComment) => {
  return db
    .query("SELECT username FROM users;")
    .then(({ rows }) => {
      const userArr = [];
      rows.forEach((user) => {
        userArr.push(user.username);
      });
      if (!userArr.includes(newComment.username)) {
        return Promise.reject({ status: 400, msg: "Invalid user" });
      }
      return db.query("INSERT INTO comments (body, review_id, author, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [newComment.body, review_id, newComment.username, 0, new Date()]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
