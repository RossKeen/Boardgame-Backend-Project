const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db.query("SELECT * FROM reviews WHERE review_id = $1;", [review_id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No review exists with that ID" });
    }
    return res.rows[0];
  });
};
