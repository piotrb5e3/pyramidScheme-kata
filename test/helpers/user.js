const faker = require('faker');
const moment = require('moment-timezone');


module.exports = {
  setupAndGetValidAuthTokenForUser(user) {
    return this.setupAndGetAuthTokenForUserValidTo(user, moment().add(1,'d'));
  },
  setupAndGetExpiredAuthTokenForUser(user) {
    return this.setupAndGetAuthTokenForUserValidTo(user, moment().subtract(1,'d'));
  },
  setupAndGetAuthTokenForUserValidTo: async function(user, validTo) {
    const newAuthToken = faker.random.alphaNumeric(32);
    const tokenValidTo = validTo.format();
    await User.update({ id: user.id }, { authToken: newAuthToken, authTokenValidTo: tokenValidTo });
    return newAuthToken;
  },
  addFundsAndRefetchUser: async function(amount, user) {
    await User.update({ id: user.id }, { balance: user.balance + amount });
    return User.findOne({ id: user.id });
  },
};
