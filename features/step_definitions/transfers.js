const expect = require('chai').expect;
const { Then } = require('cucumber');

const transferQueueMock = require('../../test/mocks/transfer-queue');

Then(/transfer of (\d+) credits was enqueued for (\w+)/, async (amount, username) => {
  if (username === 'treasury') {
    expect(transferQueueMock.getAmountTransferredForTreasury()).to.equal(amount);
  } else {
    const user = await User.findOne({ username });
    expect(user).to.exist;
    expect(transferQueueMock.getAmountTransferredForUserId(user.id)).to.equal(amount);
  }
});

Then(/no transfer was enqueued for (\w+)/, async (username) => {
  const user = await User.findOne({ username });
  expect(user).to.exist;
  expect(transferQueueMock.getAmountTransferredForUserId(user.id)).to.equal(0);
});

