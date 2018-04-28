const expect = require('chai').expect;
const supertest = require('supertest');
const { Given, When, Then } = require('cucumber');

const userHelper = require('../../test/helpers/user');
const constants = require('../../test/constants');

const transferQueueMock = require('../../test/mocks/transfer-queue');

Given(/(\w) is a participant/, (username) => {
  return User.create({ username, passwordHash: '#', isAdmin: false });
});

Given(/(\w) starts with balance of (\d+) credits/, async (username, balance) => {
  const user = await User.findOne({ username });
  return User.update({ id: user.id }, { balance });
});

When(/(\w) transfers-in (\d+) credits/, async function(username, amount) {
  let user = await User.findOne({ username });
  const authToken = await userHelper.setupAndGetValidAuthTokenForUser(user);
  const credits = '$'.repeat(amount);
  this.response = await supertest(sails.hooks.http.app)
    .post('/transfer-in')
    .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
    .send({ credits });
});

Then(/server responds with success/, function () {
  expect(this.response).to.have.property('status').equal(200);
});

Then(/(\w) has balance of (\d+) credits/, async (username, balance) => {
  const user = await User.findOne({ username });
  expect(user).to.have.property('balance').equal(balance);
});

Then(/transfer of (\d+) credits was enqueued for (\w)/, async (amount, username) => {
  const user = await User.findOne({ username });
  expect(transferQueueMock.getAmountTransferredForUserId(user.id)).to.equal(amount);
});

