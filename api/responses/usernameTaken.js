const errors = require('../constants/errors');

module.exports = function usernameTaken() {
  const res = this.res;
  res.status(409);
  return res.send(errors.usernameTaken);
};
