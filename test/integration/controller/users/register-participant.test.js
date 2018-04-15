var supertest = require('supertest');
var faker = require('faker');

var expect = require('chai').expect;

describe('users/register-participant', () => {
  describe('#register-participant()', () => {
    it('should register new user with unique username', async () => {
      const username = faker.internet.userName();
      const password = faker.internet.password();

      await supertest(sails.hooks.http.app)
        .post('/register')
        .send({ username, password })
        .expect(201)
        .expect({ isAdmin: false, username });

      const users = await User.find();
      expect(users).to.have.lengthOf(1);
      const user = users[0];
      expect(user.username).to.be.equal(username);
      expect(user.balance).to.be.equal(0);
    });

    [true, false].forEach((isAdmin) => {
      const role = isAdmin ? 'admin' : 'participant';
      it(`should not register new user with username taken by ${role}`, async () => {
        const username = faker.internet.userName();
        const password = faker.internet.password();

        const existingUser = await User.create({
          username,
          salt: faker.random.alphaNumeric(10),
          passwordHash: faker.random.alphaNumeric(10),
          isAdmin,
        }).fetch();

        await supertest(sails.hooks.http.app)
          .post('/register')
          .send({ username, password })
          .expect(409)
          .expect(({ body }) => {
            expect(body.code).to.be.equal('E_USERNAME_TAKEN');
            expect(body.message).to.be.a('string');
          });

        const users = await User.find();
        expect(users).to.have.lengthOf(1);
        const user = users[0];
        expect(user.id).to.be.equal(existingUser.id);
      });
    });


    it('should handle missing password', async () => {
      const username = faker.internet.userName();
      await supertest(sails.hooks.http.app)
        .post('/register')
        .send({ username })
        .expect(400);

      const users = await User.find();
      expect(users).to.have.lengthOf(0);
    });

    it('should handle missing username', async () => {
      const password = faker.internet.password();
      await supertest(sails.hooks.http.app)
        .post('/register')
        .send({ password })
        .expect(400);

      const users = await User.find();
      expect(users).to.have.lengthOf(0);
    });

    it('should handle too short password', async () => {
      const password = faker.internet.password(3);
      const username = faker.internet.userName();
      await supertest(sails.hooks.http.app)
        .post('/register')
        .send({ password, username })
        .expect(400);

      const users = await User.find();
      expect(users).to.have.lengthOf(0);
    });

    it('should handle too short username', async () => {
      const password = faker.internet.password();
      const username = faker.random.alphaNumeric(1);
      await supertest(sails.hooks.http.app)
        .post('/register')
        .send({ password, username })
        .expect(400);

      const users = await User.find();
      expect(users).to.have.lengthOf(0);
    });
  });
});
