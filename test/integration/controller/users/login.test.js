const supertest = require('supertest');
const expect = require('chai').expect;
const faker = require('faker');
const moment = require('moment-timezone');

const userFactory = require('../../../factory/user');

DATETIME_WITH_TZ_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;

describe('users/login', () => {
  describe('#login()', () => {
    it(`should return 401 on login with username of nonexisting user`, async () => {
      const password = faker.internet.password();
      const username = faker.internet.userName();
      return supertest(sails.hooks.http.app)
      .post('/login')
      .send({ username, password })
      .expect(401)
      .expect(({ body }) => {
        expect(body.code).to.be.equal('E_BAD_CREDENTIALS');
        expect(body.message).to.be.a('string');
      });
    });

    [true, false].forEach(isAdmin => {
      const role = isAdmin ? 'admin' : 'participant';
      it(`should return auth token and valid-to date on login of ${role}`, async () => {
        const password = faker.internet.password();
        const user = await userFactory.createUserWithPassword(password, isAdmin);

        const username = user.username;
        return supertest(sails.hooks.http.app)
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
          });
      });

      it(`should return 401 on login with bad password for ${role}`, async () => {
        const password = faker.internet.password();
        const user = await userFactory.createUserWithPassword(password, isAdmin);

        const username = user.username;
        return supertest(sails.hooks.http.app)
        .post('/login')
        .send({ username, password: 'BAD_P4SSWD' })
        .expect(401)
        .expect(({ body }) => {
          expect(body.code).to.be.equal('E_BAD_CREDENTIALS');
          expect(body.message).to.be.a('string');
        });
      });
    });
  });
});
