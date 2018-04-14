var sails = require('sails');

const chai = require('chai');
chai.use(require('chai-moment'));

const moment = require('moment-timezone');
moment.locale('en');

// Before running any tests...
before(function (done) {

  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout(20000);

  sails.lift({
    // Your sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    // For example, we might want to skip the Grunt hook,
    // and disable all logs except errors and warnings:
    hooks: { grunt: false },
    log: { level: 'warn' },

  }, (err) => {
    if (err) { return done(err); }

    // here you can load fixtures, etc.
    // (for example, you might want to create some records in the database)

    return done();
  });
});

// After all tests have finished...
after((done) => {
  sails.lower(done);
});

// Clean up after each test
afterEach((done) => {
  User.destroy({})
    .then(() => done());
});
