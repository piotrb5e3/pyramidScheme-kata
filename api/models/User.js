const moment = require('moment-timezone');

module.exports = {
  attributes: {
    username: { type: 'string', required: true },
    passwordHash: { type: 'string', required: true },
    isAdmin: { type: 'boolean', required: true },
    balance: { type: 'number', defaultsTo: 0 },
    authToken: { type: 'string' },
    authTokenValidTo: { type: 'string', defaultsTo: moment(0).format() },
  },

};

