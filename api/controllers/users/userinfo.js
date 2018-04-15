module.exports = {

  friendlyName: 'Userinfo',

  description: 'Logged user status',

  inputs: {
  },

  exits: {
  },

  fn: async function (inputs, exits) {
    const user = this.req.user;

    exits.success({
      username: user.username,
      isAdmin: user.isAdmin,
      validTo: user.authTokenValidTo,
    });
  }


};
