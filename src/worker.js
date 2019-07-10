const express = require('express');

const nconf = require('./config');
const logger = require('./logger');
const { workerHealthRouter } = require('./routes/health');
const { createConsumer } = require('./utils/messageConsumer');
const metrics = require('./utils/metrics');

const messageConsumer = createConsumer();
messageConsumer.start();

// Only health endpoints for the worker
const app = express();
app.use('/health', workerHealthRouter);
app.listen(nconf.get('app:port'), () => {
  logger.info('Worker is up and running!');
  metrics.metricsServer();
  metrics.expressRequest(app);
});

module.exports = app;
