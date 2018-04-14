const registrationService = require('../../services/users/registration');
module.exports = {


  friendlyName: 'Register participant',


  description: '',


  inputs: {
    username: {
      type: 'string',
      required: true,
      minLength: 3,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6,
    },
  },


  exits: {
    success: {
      statusCode: 201,
    },
    usernameTaken: {
      statusCode: 409,
    }
  },


  fn: async function (inputs, exits) {
    return registrationService.registerParticipant(inputs.username, inputs.password)
      .then((user) => {
        if (user) {
          exits.success({
            username: user.username,
            isAdmin: user.isAdmin,
          });
        } else {
          exits.usernameTaken();
        }
      });
  }


};
