var supertest = require('supertest');

describe('misc/hello', () => {

  describe('#hello()', () => {
    it('should return "Hello World!"', (done) => {
      supertest(sails.hooks.http.app)
        .get('/hello')
        .expect(200)
        .expect({ message: 'Hello world!' }, done);
    });
  });
});
