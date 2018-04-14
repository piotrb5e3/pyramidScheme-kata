module.exports = {

  attributes: {
    username: { type: 'string', required: true },
    salt: { type: 'string', required: true },
    passwordHash: { type: 'string', required: true },
    isAdmin: { type: 'boolean', required: true },
    balance: { type: 'number', defaultsTo: 0 },
  },

};

