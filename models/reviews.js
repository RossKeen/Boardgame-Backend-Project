const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db.query("SELECT * FROM reviews WHERE review_id = $1;", [review_id]).then((res) => {
    return res.rows[0];
  });
};
