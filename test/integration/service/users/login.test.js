const moment = require('moment-timezone');
const faker = require('faker');
const expect = require('chai').expect;
const userFactory = require('../../../factory/user');

const loginService = require('../../../../api/services/users/login');

describe('loginService', () => {
  describe('#loginUserOrNull()', () => {
    it('should return user on successful login', (done) => {
      const password = faker.internet.password();
      userFactory.createParticipantWithPassword(password)
        .then(user => loginService.loginUserOrNull(user.username, password))
        .then(loggedInUser => {
          expect(loggedInUser).to.not.be.null;
          expect(loggedInUser).to.have.property('username');
          expect(loggedInUser.username).to.not.be.null;
        })
        .then(() => done());
    });

    it('should set authToken and valid-to date on successful login', (done) => {
      const password = faker.internet.password();
      userFactory.createParticipantWithPassword(password)
        .then(user => loginService.loginUserOrNull(user.username, password))
        .then(loggedInUser => {
          const currentMoment = moment.now();
          expect(loggedInUser).to.not.be.null;
          expect(loggedInUser.authToken).to.have.length(32);
          expect(loggedInUser.authTokenValidTo).to.exist;
          expect(loggedInUser.authTokenValidTo).to.be.afterMoment(currentMoment);
        })
        .then(done)
        .catch(done);
    });

    it('should return null on incorrect password', (done) => {
      const password = faker.internet.password(15);
      const badPassword = 'BAD_P4SS';
      userFactory.createParticipantWithPassword(password)
        .then(user => loginService.loginUserOrNull(user.username, badPassword))
        .then(loggedInUser => expect(loggedInUser).to.be.null)
        .then(() => done());
    });

    it('should return null on non existing username', (done) => {
      const nonexistingUsername = faker.internet.userName();
      const password = faker.internet.password(15);
      loginService.loginUserOrNull(nonexistingUsername, password)
        .then(loggedInUser => expect(loggedInUser).to.be.null)
        .then(() => done());
    });
  });
});
