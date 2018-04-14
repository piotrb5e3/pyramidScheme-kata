module.exports = {


  friendlyName: 'Hello',


  description: 'Hello misc.',


  inputs: {

  },


  exits: {
    success: {
      responseType: 'json',
    }
  },


  fn: async function (inputs, exits) {
    return exits.success({ message: 'Hello world!' });
  }

};
