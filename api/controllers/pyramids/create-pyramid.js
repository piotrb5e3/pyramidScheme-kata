const CREATE_PYRAMID_FEE = 1;

module.exports = {


  friendlyName: 'Create pyramid',


  description: '',


  inputs: {

  },


  exits: {
    insufficientFunds: {
      responseType: 'insufficientFunds',
    },
    success: {
      responseType: 'created',
    }
  },


  fn: async function (inputs, exits) {
    const user = this.req.user;
    if (user.balance <= 0) {
      return exits.insufficientFunds();
    }
    const pyramid = await Pyramid.create({ creator: user.id }).fetch();
    await PyramidNode.createRoot(pyramid, user);
    await User.update({ id: user.id }, { balance: user.balance - CREATE_PYRAMID_FEE });
    await sails.helpers.queueTransferForTreasury(CREATE_PYRAMID_FEE);
    return exits.success({
      id: pyramid.id,
    });
  }
};
