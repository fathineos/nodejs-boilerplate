const express = require('express');

const logger = require('../logger');
const health = require('../utils/health');
const metrics = require('../utils/metrics');
const queue = require('../utils/queue');

const workerHealthRouter = express.Router();

const gauge = new metrics.prometheusClient.Gauge({
  name: `queue_messages`,
  help: 'number of messages in the queue',
});

workerHealthRouter.get('', async (req, res) => {
  res.statusCode = 204;
  try {
    await health.EsIsAlive();
  } catch (error) {
    logger.error(`Elasticsearch health error: ${error.message}`);
    res.statusCode = 500;
    res.statusMessage = 'Elasticsearch connection error';
  }
  try {
    gauge.set(await queue.GetMessagesCount());
  } catch (error) {
    logger.error(`sqs health error: ${error.message}`);
    res.statusCode = 500;
    res.statusMessage = 'SQS connection error';
  }

  res.send();
});

module.exports = { workerHealthRouter };
