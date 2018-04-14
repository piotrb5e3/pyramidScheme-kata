var supertest = require('supertest');
var faker = require('faker');

var expect = require('chai').expect;

describe('users/register-participant', () => {
  describe('#register-participant()', () => {
    it('should register new user with unique username', (done) => {
      const username = faker.internet.userName();
      const password = faker.internet.password();
      supertest(sails.hooks.http.app)
        .post('/register')
        .send({ username, password })
        .expect(201)
        .expect({ isAdmin: false, username })
        .expect(() => User.find()
          .then((users) => {
            expect(users).to.have.lengthOf(1);
            const user = users[0];
            expect(user.username).to.be.equal(username);
            expect(user.balance).to.be.equal(0);
          }))
        .end(done);
    });

    [true, false].forEach((isAdmin) => {
      it(`should not register new user with username taken by user with isAdmin: ${isAdmin}`, (done) => {
        const username = faker.internet.userName();
        const password = faker.internet.password();

        User.create({
          username,
          salt: faker.random.alphaNumeric(10),
          passwordHash: faker.random.alphaNumeric(10),
          isAdmin,
        }).fetch().then(createdUser => {
          supertest(sails.hooks.http.app)
            .post('/register')
            .send({ username, password })
            .expect(409)
            .expect(() => User.find()
              .then((users) => {
                expect(users).to.have.lengthOf(1);
                const user = users[0];
                expect(user.id).to.be.equal(createdUser.id);
              }))
            .end(done);
        });
      });
    });

    it('should handle missing password', (done) => {
      const username = faker.internet.userName();
      supertest(sails.hooks.http.app)
        .post('/register')
        .send({ username })
        .expect(400)
        .expect(() => User.find()
          .then((users) => {
            expect(users).to.have.lengthOf(0);
          }))
        .end(done);
    });

    it('should handle missing username', (done) => {
      const password = faker.internet.password();
      supertest(sails.hooks.http.app)
        .post('/register')
        .send({ password })
        .expect(400)
        .expect(() => User.find()
          .then((users) => {
            expect(users).to.have.lengthOf(0);
          }))
        .end(done);
    });

    it('should handle too short password', (done) => {
      const password = faker.internet.password(3);
      const username = faker.internet.userName();
      supertest(sails.hooks.http.app)
        .post('/register')
        .send({ password, username })
        .expect(400)
        .expect(() => User.find()
          .then((users) => {
            expect(users).to.have.lengthOf(0);
          }))
        .end(done);
    });

    it('should handle too short username', (done) => {
      const password = faker.internet.password();
      const username = faker.random.alphaNumeric(1);
      supertest(sails.hooks.http.app)
        .post('/register')
        .send({ password, username })
        .expect(400)
        .expect(() => User.find()
          .then((users) => {
            expect(users).to.have.lengthOf(0);
          }))
        .end(done);
    });
  });
});
