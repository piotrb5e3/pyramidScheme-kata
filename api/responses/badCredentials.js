const errors = require('../constants/errors');

module.exports = function badCredentials() {
  const res = this.res;
  res.status(401);
  return res.send(errors.badCredentials);
};
