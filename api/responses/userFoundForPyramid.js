const errors = require('../constants/errors');

module.exports = function userFoundForPyramid() {
  const res = this.res;
  res.status(400);
  return res.send(errors.userFoundForPyramid);
};
