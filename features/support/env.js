var sails = require('sails');
const chai = require('chai');
chai.use(require('chai-moment'));

const moment = require('moment-timezone');
moment.locale('en');

const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');

const transferQueueMock = require('../../test/mocks/transfer-queue');

setDefaultTimeout(20 * 1000);

// Before running any tests...
BeforeAll((done) => {

  sails.lift({
    // Your sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    // For example, we might want to skip the Grunt hook,
    // and disable all logs except errors and warnings:
    hooks: { grunt: false },
    log: { level: 'warn' },

  }, (err) => {
    if (err) { return done(err); }
    return done();
  });
});

// After all tests have finished...
AfterAll(async () => {
  await Treasury.destroy({});
  await Treasury.setup();
  await sails.lower();
});

Before(async () => {
  await Treasury.destroy({});
  await Treasury.setup();
});

// Clean up after each test
After(async () => {
  await User.destroy({});
  await Pyramid.destroy({});
  await PyramidNode.destroy({});
});

Before({ tags: '@withStubbedQueue' }, () => {
  transferQueueMock.setup();
});

After({ tags: '@withStubbedQueue' }, () => {
  transferQueueMock.teardown();
});
