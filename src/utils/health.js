const esClient = require('../common/esClient');

async function EsIsAlive() {
  await esClient.ping({ requestTimeout: 20000 });
}

module.exports = { EsIsAlive };
