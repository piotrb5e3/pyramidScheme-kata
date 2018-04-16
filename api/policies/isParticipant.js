const errors = require('../constants/errors');

module.exports = async function (req, res, proceed) {
  if (!req.user.isAdmin) {
    return proceed();
  }

  return res.insufficientPermissions(errors.notAParticipant);
};
