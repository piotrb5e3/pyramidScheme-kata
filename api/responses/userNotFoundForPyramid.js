const errors = require('../constants/errors');

module.exports = function userNotFoundForPyramid() {
  const res = this.res;
  res.status(404);
  return res.send(errors.userNotFoundForPyramid);
};
