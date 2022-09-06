exports.send400 = (req, res, next) => {
  res.status(400).send({ msg: "Bad path" });
};
