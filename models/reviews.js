const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comments.comment_id) AS comment_count 
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
