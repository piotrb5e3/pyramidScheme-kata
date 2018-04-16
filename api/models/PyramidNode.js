module.exports = {
  attributes: {
    parent: { model: 'PyramidNode' },
    pyramid: { model: 'Pyramid', required: true },
    user: { model: 'User', required: true },
    depth: { type: 'number', required: true },
  },
  createRoot(pyramid, user) {
    return PyramidNode.create({ parent: null, pyramid: pyramid.id, user: user.id, depth: 0 });
  },
};
