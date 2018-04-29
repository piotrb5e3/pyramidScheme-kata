const errors = require('../constants/errors');

module.exports = function userNotFound() {
  const res = this.res;
  res.status(404);
  return res.send(errors.userNotFound);
};
