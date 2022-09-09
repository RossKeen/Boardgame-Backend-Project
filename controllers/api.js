const { selectEndpoints } = require("../models/api");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      next(err);
    });
};
