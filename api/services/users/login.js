const userManagementService = require('./management');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const cryptoRandomString = require('crypto-random-string');

const AUTH_TOKEN_LENGTH = 32;
const AUTH_TOKEN_VALID_DAYS = 5;

module.exports = {
  loginUserOrNull: async function (username, password) {
    const user = await userManagementService.findUserByUsername(username);
    if (user) {
      if (await bcrypt.compare(password, user.passwordHash)) {
        const authToken = this._generateNewAuthToken();
        const authTokenValidTo = this._getNewAuthTokenExpiryDate();
        await User.update({ id: user.id }, { authToken, authTokenValidTo });
        return userManagementService.findUserByUsername(username);
      }
    }
    return null;
  },

  _generateNewAuthToken() {
    return cryptoRandomString(AUTH_TOKEN_LENGTH);
  },

  _getNewAuthTokenExpiryDate() {
    return moment().add(AUTH_TOKEN_VALID_DAYS, 'd').format();
  }
};
