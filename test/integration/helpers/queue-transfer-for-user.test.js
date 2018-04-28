const expect = require('chai').expect;
const userFactory = require('../../factory/user');

describe('queueTransferForUser helper', () => {
  describe('#queueTransferForUser()', () => {
    beforeEach(async function () {
      this.adminUser = await userFactory.createAdmin();
      this.participantUser = await userFactory.createParticipant();
    });

    it('should exit with "userNotFound" when called with nonexistent user', async () => {
      const transferPromise = sails.helpers.queueTransferForUser(10, 777);
      await expect(transferPromise).to.be.rejectedWith('userNotFound');
    });

    it('should exit with "userNotAParticipant" when called with admin user', async function () {
      const transferPromise = sails.helpers.queueTransferForUser(10, this.adminUser.id);
      await expect(transferPromise).to.be.rejectedWith('userNotAParticipant');
    });

    [0, 1.2345, -13].forEach((amount) =>
      it(`should exit with "Invalid amount" when called with amount of ${amount}`, async function () {
        const transferPromise = sails.helpers.queueTransferForUser(amount, this.participantUser.id);
        await expect(transferPromise).to.be.rejectedWith('Invalid "amount"');
      })
    );

    it('should queue transfer correctly');
  });
});
