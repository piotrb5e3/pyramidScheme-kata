const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = {
  createParticipantWithPassword(password) {
    return this.createUserWithPassword(password, false);
  },

  createAdminWithPassword(password) {
    return this.createUserWithPassword(password, true);
  },

  createUserWithPassword: async function(password, isAdmin) {
    const passwordHash = await this._getHashedPassword(password);
    return User.create({
      username: faker.internet.userName(),
      passwordHash,
      isAdmin,
    }).fetch();
  },

  _getHashedPassword(password) {
    return bcrypt.hash(password, 5);
  }
};
