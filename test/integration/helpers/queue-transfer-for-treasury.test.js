const faker = require('faker');
const expect = require('chai').expect;

describe('queueTransferForTreasury helper', () => {
  describe('#queueTransferForTreasury()', () => {
    [
      0,
      1.2345,
      faker.random.number({ min: -20, max: -5 })
    ].forEach((amount) =>
      it(`should exit with "Invalid amount" when called with amount of ${amount}`, async () => {
        const transferPromise = sails.helpers.queueTransferForTreasury(amount);
        await expect(transferPromise).to.be.rejectedWith('Invalid "amount"');
      })
    );

    it('should queue transfer correctly');
  });
});
