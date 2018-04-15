const errors = require('../constants/errors');

module.exports = async function (req, res, proceed) {
  if (req.user) {
    return proceed();
  }

  return res.unauthorized(errors.noAuthToken);
};
