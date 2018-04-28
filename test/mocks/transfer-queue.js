const sinon = require('sinon');

module.exports = {
  _transfers: {},
  _treasuryTransferTotal: 0,
  _active: false,
  _stubForUser: null,
  _stubForTreasury: null,
  setup() {
    this._transfers = {};
    this._treasuryTransferTotal = 0;
    this._stubForUser = sinon.stub(sails.helpers, 'queueTransferForUser')
      .callsFake((amount, uid) => {
        this._transfers[uid] = this.getAmountTransferredForUserId(uid) + amount;
      });
    this._stubForTreasury = sinon.stub(sails.helpers, 'queueTransferForTreasury')
      .callsFake(amount => {
        this._treasuryTransferTotal += amount;
      });
    this._active = true;
  },
  teardown() {
    this._active = false;
    this._stubForUser.restore();
    this._stubForTreasury.restore();
    this._transfers = {};
    this._treasuryTransferTotal = 0;
  },
  getAmountTransferredForUserId(uid) {
    if (!this._active) {
      throw Error('Transfer queue mock not active');
    }
    return this._transfers[uid] || 0;
  },
  getAmountTransferredForTreasury() {
    if (!this._active) {
      throw Error('Transfer queue mock not active');
    }
    return this._treasuryTransferTotal;
  },
  decorateWithStubbedQueue(func) {
    return async () => {
      this.setup();
      try {
        await func();
      } finally {
        this.teardown();
      }
    };
  }
};
