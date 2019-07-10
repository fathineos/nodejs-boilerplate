const mocha = require('mocha');
const request = require('supertest');

const app = require('../../src/worker')

mocha.describe('GET /health', () => {
  mocha.it('success no content', done => {
    request(app).get('/health').expect(204, done);
  });
});
