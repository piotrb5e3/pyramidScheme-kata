const supertest = require('supertest');
const expect = require('chai').expect;
const faker = require('faker');
const moment = require('moment-timezone');

const userFactory = require('../../../factory/user');

DATETIME_WITH_TZ_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;

describe('users/login', () => {
  describe('#login()', () => {
    [
      [pwd => userFactory.createAdminWithPassword(pwd), 'admin'],
      [pwd => userFactory.createParticipantWithPassword(pwd), 'participant'],
    ].forEach(([createUserWithPassword, userRole]) => {
      it(`should return auth token and valid-to date on login of user with role ${userRole}`,
        (done) => {
          const password = faker.internet.password();
          createUserWithPassword(password).then((user) => {
            const username = user.username;
            supertest(sails.hooks.http.app)
              .post('/login')
              .send({ username, password })
              .expect(200)
              .expect(({ body }) => {
                expect(body.username).to.be.equal(username);
                expect(body.token).to.exist;
                expect(body.token).to.have.length(32);
                expect(body.validTo).to.exist;
                expect(body.validTo).to.be.afterMoment(moment.now());
                expect(body.validTo).to.match(DATETIME_WITH_TZ_PATTERN);
              })
              .end(done);
          });
        });
    });
  });
});
