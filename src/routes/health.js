const elasticsearch = require('elasticsearch');
const express = require('express');
const nconf = require('../config');
const router = express.Router();

router.get('', async (req, res) => {
  var client = new elasticsearch.Client({
    host: nconf.get('elasticsearch:host') + ':' +
      nconf.get('elasticsearch:port'),
    log: 'trace',
  });
  client.ping({
    requestTimeout: 1000,
  }, function(error) {
    if (error) {
      res.statusCode = 404;
    } else {
      res.statusCode = 204;
    }
    res.send();
  });
});

module.exports = {
  router,
};
