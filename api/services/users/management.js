module.exports = {
  findUserByUsername(username) {
    return User.findOne({username});
  },
};
