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
    await User.update({ id: user.id }, { balance: user.balance - 1 });
    await Treasury.addFunds(1);
    return exits.success({
      id: pyramid.id,
    });
  }
};
