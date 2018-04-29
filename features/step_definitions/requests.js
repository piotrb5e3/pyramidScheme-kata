const expect = require('chai').expect;
const supertest = require('supertest');
const { When, Then } = require('cucumber');

const userHelper = require('../../test/helpers/user');
const constants = require('../../test/constants');

async function getUserAuthTokenOrNullForAnonymous(username) {
  if (username === 'anonymous') {
    return null;
  }
  const user = await User.findOne({ username });
  return userHelper.setupAndGetValidAuthTokenForUser(user);
}

When(/(\w+) transfers-in (\d+) credits/, async function (username, amount) {
  const authToken = await getUserAuthTokenOrNullForAnonymous(username);
  const credits = '$'.repeat(amount);
  let req = supertest(sails.hooks.http.app)
    .post('/transfer-in');
  if (authToken) {
    req = req.set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken);
  }
  this.response = await req.send({ credits });
});

When(/(\w+) joins (the pyramid|a nonexistent pyramid) off of (\w+)/,
  async function (username, target, parentUsername) {
    const authToken = await getUserAuthTokenOrNullForAnonymous(username);
    let req = supertest(sails.hooks.http.app)
      .post('/join-pyramid');
    if (authToken) {
      req = req.set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken);
    }
    this.response = await req.send({
      pyramid: target === 'the pyramid' ? this.pyramid.id : -123,
      parentUser: parentUsername,
    });
  });


Then(/server responds with (success|forbidden|unauthorized|bad request|not found)/,
  function (statusDesc) {
    const expectedStatus = {
      success: 200,
      unauthorized: 401,
      forbidden: 403,
      'bad request': 400,
      'not found': 404,
    }[statusDesc];
    expect(this.response).to.have.property('status').equal(expectedStatus);
  }
);

