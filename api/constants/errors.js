const MESSAGE_PREFIX = 'The server could not fulfill this request due to';
module.exports = {
  invalidAuthTokenFormat: {
    code: 'E_INVALID_AUTH_TOKEN_FORMAT',
    message: `${MESSAGE_PREFIX} invalid auth token format.`,
  },
  invalidAuthToken: {
    code: 'E_INVALID_AUTH_TOKEN',
    message: `${MESSAGE_PREFIX} invalid auth token.`,
  },
  expiredAuthToken: {
    code: 'E_EXPIRED_AUTH_TOKEN',
    message: `${MESSAGE_PREFIX} expired auth token.`,
  },
  noAuthToken: {
    code: 'E_NO_AUTH_TOKEN',
    message: `${MESSAGE_PREFIX} missing required auth token.`,
  },
  notAnAdmin: {
    code: 'E_USER_NOT_ADMIN',
    message: `${MESSAGE_PREFIX} user not being an administrator.`,
  },
  notAParticipant: {
    code: 'E_USER_NOT_PARTICIPANT',
    message: `${MESSAGE_PREFIX} user not being a participant.`,
  },
  usernameTaken: {
    code: 'E_USERNAME_TAKEN',
    message: `${MESSAGE_PREFIX} username being taken.`,
  },
  badCredentials: {
    code: 'E_BAD_CREDENTIALS',
    message: `${MESSAGE_PREFIX} incorrect username or password provided.`,
  },
  insufficientFunds: {
    code: 'E_INSUFFICIENT_FUNDS',
    message: `${MESSAGE_PREFIX} insufficient funds in the account.`,
  }
};
