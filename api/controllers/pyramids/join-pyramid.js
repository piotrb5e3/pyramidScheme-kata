async function queueTransfersFromNodeId(nodeId) {
  const node = await PyramidNode.findOne({id: nodeId});
  const amount = Math.pow(2, node.depth);
  await sails.helpers.queueTransferForUser(amount, node.user);
  if (node.parent) {
    await queueTransfersFromNodeId(node.parent);
  }
}

module.exports = {


  friendlyName: 'Join pyramid',


  description: '',


  inputs: {
    pyramid: {
      type: 'number',
      isInteger: true,
      required: true,
    },
    parentUser: {
      type: 'string',
      required: true,
    }
  },


  exits: {
    insufficientFunds: {
      responseType: 'insufficientFunds',
    },

    pyramidNotFound: {
      responseType: 'pyramidNotFound',
    },

    pyramidNodeNotFound: {
      responseType: 'userNotFoundForPyramid',
    },

    userNotFound: {
      responseType: 'userNotFound',
    },

    userAlreadyInPyramid: {
      responseType: 'userFoundForPyramid',
    },
  },


  fn: async function (inputs, exits) {
    const user = await User.findOne({ id: this.req.user.id });

    const pyramid = await Pyramid.findOne({ id: inputs.pyramid });
    if (!pyramid) {
      return exits.pyramidNotFound();
    }

    const parentUser = await User.findOne({ username: inputs.parentUser });
    if (!parentUser) {
      return exits.userNotFound();
    }

    const parentNode = await PyramidNode
      .findOne({ pyramid: pyramid.id, user: parentUser.id });
    if (!parentNode) {
      return exits.pyramidNodeNotFound();
    }

    if (await PyramidNode.findOne({ pyramid: pyramid.id, user: user.id })) {
      return exits.userAlreadyInPyramid();
    }

    const price = Math.pow(2, parentNode.depth + 1);
    if (user.balance < price) {
      return exits.insufficientFunds();
    }
    await User.removeFunds(user, price);

    await PyramidNode.createSubnodeForUser(parentNode, user);

    await queueTransfersFromNodeId(parentNode.id);

    await sails.helpers.queueTransferForTreasury(1);

    return exits.success();
  }


};
