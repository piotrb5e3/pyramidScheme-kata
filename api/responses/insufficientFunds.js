const errors = require('../constants/errors');

module.exports = function insufficientFunds() {
  const res = this.res;
  res.status(400);
  return res.send(errors.insufficientFunds);
};
