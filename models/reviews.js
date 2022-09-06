const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db
    .query("ALTER TABLE reviews ADD COLUMN comment_count INT;")
    .then(() => {
      return db.query("SELECT COUNT(comment_id) AS comment_count FROM reviews JOIN comments ON reviews.review_id = comments.review_id WHERE comments.review_id = 3;");
    })
    .then((res) => {
      const comment_count = res.rows[0].comment_count;
      return db.query("UPDATE reviews SET comment_count = $2 WHERE review_id = $1", [review_id, comment_count]);
    })
    .then(() => {
      return db.query("SELECT * FROM reviews WHERE review_id = $1;", [review_id]);
    })
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No review exists with that ID" });
      }
      return res.rows[0];
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
