const loginService = require('../../services/users/login');

module.exports = {
  friendlyName: 'Login',

  description: 'Login users.',

  inputs: {
    username: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 1,
    },
  },

  exits: {
    badCredentials: {
      responseType: 'badCredentials',
    }
  },


  fn: async function (inputs, exits) {
    const user = await loginService.loginUserOrNull(inputs.username, inputs.password);
    if (user) {
      exits.success({
        username: user.username,
        token: user.authToken,
        validTo: user.authTokenValidTo,
      });
    } else {
      exits.badCredentials();
    }

  }
};
