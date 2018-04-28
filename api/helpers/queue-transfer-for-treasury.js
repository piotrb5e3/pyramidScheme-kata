module.exports = {


  friendlyName: 'Queue transfer for treasury',


  description: '',


  inputs: {
    amount: {
      type: 'number',
      isInteger: true,
      min: 1,
    },
  },


  exits: {
    notImplementedYet: {
      description: 'Not implemented!!!'
    }
  },


  fn: async function (inputs, exits) {

    return exits.notImplementedYet();

  }


};

