const moment = require('moment-timezone');

const errors = require('../../constants/errors');

const AUTH_HEADER_NAME = 'x-api-auth';
const AUTH_HEADER_VALUE_REGEXP = /^TOKEN ([0-9a-z]{1,})$/;

module.exports = function authParserHook(/* sails */) {
  return {
    routes: {
      before: {
        '*': async function(req, res, next) {
          const authHeaderValue = req.headers[AUTH_HEADER_NAME];
          if (!authHeaderValue) {
            return next();
          }

          const tokenMatch = authHeaderValue.match(AUTH_HEADER_VALUE_REGEXP);
          if(!tokenMatch) {
            return res.unauthorized(errors.invalidAuthTokenFormat);
          }

          const token = tokenMatch[1];
          const user = await User.findOne({ authToken: token });
          if (!user) {
            return res.unauthorized(errors.invalidAuthToken);
          }

          if (moment(user.authTokenValidTo).isBefore(moment())) {
            return res.unauthorized(errors.expiredAuthToken);
          }
          req.user = user;
          return next();
        },
      },
    },
  };
};
