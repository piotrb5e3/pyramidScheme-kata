const passwordService = require('../crypto/password');
const userManagementService = require('./management');

module.exports = {
  registerParticipant(username, password) {
    return this._registerUser(username, password, false);
  },

  registerAdmin(username, password) {
    return this._registerUser(username, password, true);
  },

  _registerUser: async function(username, password, isAdmin) {
    if (await this._isUsernameUnique(username)) {
      return this._persistUser(username, password, isAdmin);
    } else {
      return null;
    }
  },

  _persistUser(username, password, isAdmin) {
    const salt = passwordService.generateSalt();
    const passwordHash = passwordService.hashPasswordWithSalt(password, salt);
    return User.create({
      username,
      salt,
      passwordHash,
      isAdmin,
    }).fetch();
  },

  _isUsernameUnique: async function(username) {
    const user = await userManagementService.findUserByUsername(username);
    return !user;
  }
};
