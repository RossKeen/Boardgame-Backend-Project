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

exports.selectReviews = (category) => {
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
      queryStr += ` GROUP BY reviews.review_id, reviews.created_at ORDER BY reviews.created_at DESC;`;

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
  return db.query("SELECT reviews.title, comments.* FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1;", [review_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No review exists with that ID" });
    } else if (rows[0].comment_id === null) {
      return [];
    }
    return rows;
  });
};
