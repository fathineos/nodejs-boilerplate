const { Client } = require('@elastic/elasticsearch');
const nconf = require('../config');

const client = (() => {
  return new Client({ node: nconf.get('elasticsearch:node_uri') });
})();

module.exports = client;
