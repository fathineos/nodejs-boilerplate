const express = require('express');
const router = express.Router();
const elasticsearch = require('elasticsearch');

router.get('', async (req, res) => {
  var client = new elasticsearch.Client({
    host: 'elasticsearch:9200',
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
