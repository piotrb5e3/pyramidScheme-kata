module.exports = {


  friendlyName: 'Queue transfer',


  description: '',


  inputs: {
    amount: {
      type: 'number',
      isInteger: true,
      min: 1,
    },
    userid: {
      type: 'number',
    }
  },


  exits: {
    userNotFound: {
      description: 'Could not find the specified user'
    },
    userNotAParticipant: {
      description: 'Specified user is not a participant'
    }
  },


  fn: async function (inputs, exits) {
    const user = await User.findOne({ id: inputs.userid });
    if (!user) {
      return exits.userNotFound();
    }

    if (user.isAdmin) {
      return exits.userNotAParticipant();
    }

    return exits.success();
  }


};

