const moment = require('moment-timezone');
const assert = require('assert');
module.exports = {
  attributes: {
    username: { type: 'string', required: true },
    passwordHash: { type: 'string', required: true },
    isAdmin: { type: 'boolean', required: true },
    balance: { type: 'number', defaultsTo: 0 },
    authToken: { type: 'string' },
    authTokenValidTo: { type: 'string', defaultsTo: moment(0).format() },
  },
  addFunds(user, amount) {
    assert(amount >= 0, 'Cannot add negative funds');
    return this._alterFunds(user, amount);
  },
  removeFunds(user, amount) {
    assert(amount >= 0, 'Cannot remove negative funds');
    return this._alterFunds(user, -amount);
  },
  _alterFunds(user, diff) {
    assert(user.balance + diff >= 0, 'Users can\'t have negative balances');
    return User.update(user.id, { balance: user.balance + diff });
  }
};

