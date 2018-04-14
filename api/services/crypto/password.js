module.exports = {
  generateSalt() {
    return 'FOOBAR';
  },
  hashPasswordWithSalt(password, salt) {
    return password + salt;
  }
};
