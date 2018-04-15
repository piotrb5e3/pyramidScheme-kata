const supertest = require('supertest');
const expect = require('chai').expect;
const faker = require('faker');
const moment = require('moment-timezone');

const userFactory = require('../../../factory/user');
const userHelpers = require('../../../helpers/user');

const constants = require('../../../constants');

describe('users/userinfo', () => {
  describe('#userinfo()', () => {
    it('Should return 401 for anonymous user', async () => {
      return supertest(sails.hooks.http.app)
        .get('/userinfo')
        .expect(401)
        .expect(({ body }) => {
          expect(body.code).to.be.equal('E_NO_AUTH_TOKEN');
          expect(body.message).to.be.a('string');
        });
    });

    it('Should return 401 for invalid auth format', async () => {
      return supertest(sails.hooks.http.app)
        .get('/userinfo')
        .set(constants.AUTH_HEADER_NAME, 'BADTOKEN format12345')
        .expect(401)
        .expect(({ body }) => {
          expect(body.code).to.be.equal('E_INVALID_AUTH_TOKEN_FORMAT');
          expect(body.message).to.be.a('string');
        });
    });

    [true, false].forEach((isAdmin) => {
      const role = isAdmin ? 'admin' : 'participant';

      it(`Should return 200 for logged-in ${role}`, async () => {
        const password = faker.internet.password();
        const user = await userFactory.createUserWithPassword(password, isAdmin);
        const token = await userHelpers.setupAndGetValidAuthTokenForUser(user);
        return supertest(sails.hooks.http.app)
          .get('/userinfo')
          .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + token)
          .expect(200)
          .expect(({ body }) => {
            expect(body.username).to.be.equal(user.username);
            expect(body.isAdmin).to.be.equal(isAdmin);
            expect(body.validTo).to.be.afterMoment(moment());
          });
      });

      it(`Should return 401 on expired credentials for ${role}`, async () => {
        const password = faker.internet.password();
        const user = await userFactory.createUserWithPassword(password, isAdmin);
        const token = await userHelpers.setupAndGetExpiredAuthTokenForUser(user);
        return supertest(sails.hooks.http.app)
          .get('/userinfo')
          .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + token)
          .expect(401)
          .expect(({ body }) => {
            expect(body.code).to.be.equal('E_EXPIRED_AUTH_TOKEN');
            expect(body.message).to.be.a('string');
          });
      });
    });
  });
});
