const expect = require('chai').expect;
const { Given, Then } = require('cucumber');


Given(/pyramid created by (\w+) exists/, async function (username) {
  const user = await User.findOne({ username });
  this.pyramid = await Pyramid.create({ creator: user.id }).fetch();
  await PyramidNode.createRoot(this.pyramid, user);
});

Given(/pyramid has following nodes:/, async function (dataTable) {
  for ({ username, parentUsername } of dataTable.hashes()) {
    const user = await User.findOne({ username });
    const parentUser = await User.findOne({ username: parentUsername });
    const parentNode = await PyramidNode.findOne({ pyramid: this.pyramid.id, user: parentUser.id });
    await PyramidNode.createSubnodeForUser(parentNode, user);
  }
});

Then(/a node exists in the pyramid for (\w+) with parent (\w+)/,
  async function (username, parentUsername) {
    const user = await User.findOne({ username });
    const parentNodeUser = await User.findOne({ username: parentUsername });
    const node = await PyramidNode
      .findOne({ pyramid: this.pyramid.id, user: user.id })
      .populate('parent');
    expect(node).to.exist;
    expect(node.parent.user).to.equal(parentNodeUser.id);
  }
);

Then(/no node exists for (\w+) in the pyramid/, async function (username) {
  const user = await User.findOne({ username });
  const node = await PyramidNode.findOne({ pyramid: this.pyramid.id, user: user.id });
  expect(node).to.not.exist;
});
