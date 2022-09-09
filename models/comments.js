const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  if (!parseInt(comment_id)) {
    return Promise.reject({ status: 400, msg: "Invalid comment ID" });
  } else {
    return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
  }
};
