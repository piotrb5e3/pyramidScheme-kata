const expect = require('chai').expect;
const { Given, Then } = require('cucumber');


Given(/(\w+) is a participant/, (username) => {
  return User.create({ username, passwordHash: '#', isAdmin: false });
});

Given(/(\w+) is an admin/, (username) => {
  return User.create({ username, passwordHash: '#', isAdmin: true });
});

Given(/(\w+) starts with balance of (\d+) credits/, async (username, balance) => {
  const user = await User.findOne({ username });
  return User.update({ id: user.id }, { balance });
});

Then(/(\w+) has balance of (\d+) credits/, async (username, balance) => {
  const user = await User.findOne({ username });
  expect(user).to.have.property('balance').equal(balance);
});

Given(/the following users exist:/, async (dataTable) => {
  const userCreatePromises = dataTable.hashes().map(({ username, balance, isAdmin }) =>
    User.create({ username, passwordHash: '#', isAdmin, balance }));
  await Promise.all(userCreatePromises);
});
