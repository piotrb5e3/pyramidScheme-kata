module.exports = {


  friendlyName: 'Transfer in',


  description: '',


  inputs: {
    credits: {
      type: 'string',
      regex: /^\$*$/,
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const user = this.req.user;
    const credits = inputs.credits.length;
    await sails.helpers.queueTransferForUser(credits, user.id);
    return exits.success();
  }


};
