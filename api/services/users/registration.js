const userManagementService = require('./management');
const bcrypt = require('bcrypt');

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

  _persistUser: async function(username, password, isAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    return User.create({
      username,
      passwordHash,
      isAdmin,
    }).fetch();
  },

  _isUsernameUnique: async function(username) {
    const user = await userManagementService.findUserByUsername(username);
    return !user;
  }
};
