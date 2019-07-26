const request = require('supertest');
const mocha = require('mocha');
const server = require('../../src/server');

var describe = mocha.describe;
var it = mocha.it;

describe('GET /health', function() {
  it('success no content', function(done) {
    server().then(app => {
      request(app).get('/health').expect(204, done)
    });
  });
});
