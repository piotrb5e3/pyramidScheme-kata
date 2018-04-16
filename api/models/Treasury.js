module.exports = {
  attributes: {
    isTreasury: { type: 'number', unique: true, required: true, min: 1, max: 1 },
    balance: { type: 'number', defaultsTo: 0 }
  },
  getBalance: async function () {
    const treasuryInstance = await Treasury.findOne({ isTreasury: 1 });
    return treasuryInstance.balance;
  },
  addFunds: async function (amount) {
    const balance = await this.getBalance();
    return this._setBalance(balance + amount);
  },
  _setBalance(balance) {
    return Treasury.update({ isTreasury: 1 }, { balance });
  },
  setup() {
    return Treasury.create({ isTreasury: 1 });
  },
};
