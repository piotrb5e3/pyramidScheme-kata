const supertest = require('supertest');
const expect = require('chai').expect;
const faker = require('faker');

const CREATE_PYRAMID_URL = '/create-pyramid';

const userFactory = require('../../../factory/user');
const userHelper = require('../../../helpers/user');
const constants = require('../../../constants');

const transferQueueMock = require('../../../mocks/transfer-queue');

describe('pyramids/create-pyramid', () => {
  describe('#createPyramid()', () => {

    beforeEach(() => transferQueueMock.setup());
    afterEach(() => transferQueueMock.teardown());

    it('should not create pyramid for unauthenticated user', async () => {
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .expect(401)
        .expect(({ body }) => {
          expect(body.code).to.be.equal('E_NO_AUTH_TOKEN');
          expect(body.message).to.be.a('string');
        });
      const pyramids = await Pyramid.find();
      expect(pyramids).to.have.length(0);
    });

    it('should not create pyramid for admin', async () => {
      const admin = await userFactory.createAdmin();
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(admin);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(403)
        .expect(({ body }) => {
          expect(body.code).to.be.equal('E_USER_NOT_PARTICIPANT');
          expect(body.message).to.be.a('string');
        });
      const pyramids = await Pyramid.find();
      expect(pyramids).to.have.length(0);
    });

    it('should not create pyramid for participant with insufficient funds', async () => {
      const participant = await userFactory.createParticipant();
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(400)
        .expect(({ body }) => {
          expect(body.code).to.be.equal('E_INSUFFICIENT_FUNDS');
          expect(body.message).to.be.a('string');
        });
      const pyramids = await Pyramid.find();
      expect(pyramids).to.have.length(0);
    });

    it('should create pyramid for participant with sufficient balance', async () => {
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(1, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);

      const pyramids = await Pyramid.find().populate('creator');
      expect(pyramids).to.have.length(1);
      const createdPyramid = pyramids[0];
      expect(createdPyramid.creator.id).to.be.equal(participant.id);
    });

    it('should create pyramid root node with correct user', async () => {
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(1, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);
      const pyramidNodes = await PyramidNode.find();
      expect(pyramidNodes).to.have.length(1);
      expect(pyramidNodes[0].user).to.be.equal(participant.id);
    });

    it('should create pyramid root node with correct pyramid', async () => {
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(1, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);
      const pyramids = await Pyramid.find();
      expect(pyramids).to.have.length(1);
      const pyramidNodes = await PyramidNode.find();
      expect(pyramidNodes).to.have.length(1);
      expect(pyramidNodes[0].pyramid).to.be.equal(pyramids[0].id);
    });

    it('should create pyramid root node with correct parent', async () => {
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(1, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);
      const pyramidNodes = await PyramidNode.find();
      expect(pyramidNodes).to.have.length(1);
      expect(pyramidNodes[0].parent).to.be.null;
    });

    it('should create pyramid root node with correct depth', async () => {
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(1, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);
      const pyramidNodes = await PyramidNode.find();
      expect(pyramidNodes).to.have.length(1);
      expect(pyramidNodes[0].depth).to.be.equal(0);
    });

    it('should return created pyramid\'s id', async () => {
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(1, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      const response = await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);
      const pyramids = await Pyramid.find();
      expect(pyramids).to.have.length(1);
      expect(response.body).to.have.property('id').equal(pyramids[0].id);
    });

    it('should charge creator 1 token for pyramid creation', async () => {
      const startingFunds = faker.random.number(100);
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(startingFunds, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);
      participant = await User.findOne({ id: participant.id });
      expect(participant).to.have.property('balance').equal(startingFunds - 1);
    });

    it('should place the charged token into treasury transfer queue', async () => {
      const startingFunds = faker.random.number(100);
      let participant = await userFactory.createParticipant();
      participant = await userHelper.addFundsAndRefetchUser(startingFunds, participant);
      const authToken = await userHelper.setupAndGetValidAuthTokenForUser(participant);
      await supertest(sails.hooks.http.app)
        .post(CREATE_PYRAMID_URL)
        .set(constants.AUTH_HEADER_NAME, constants.AUTH_HEADER_VALUE_PREFIX + authToken)
        .expect(201);
      expect(transferQueueMock.getAmountTransferredForTreasury()).to.equal(1);
    });
  });
});
