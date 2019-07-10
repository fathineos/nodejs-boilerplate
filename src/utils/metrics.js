const express = require('express');
const promBundle = require('express-prom-bundle');

const nconf = require('../config');
const logger = require('./../logger');
const prometheusBundle = promBundle({
  includePath: true,
  includeMethod: true,
  autoregister: false, // Do not register the metrics endpoint
  promClient: {
    collectDefaultMetrics: {},
  },
});
const prometheusClient = prometheusBundle.promClient;

prometheusClient.register.setDefaultLabels({
  application: nconf.get('app:name'),
  environment: process.env.NODE_ENV,
});

/**
 * Express middleware that should be applied before
 * any other middleware
 *
 * @param {*} app
 */
function expressRequest(app) {
  app.use(prometheusBundle);
}

/**
 * Dedicated server for prometheus metrics data collection
 */
function metricsServer() {
  const metricsApp = express();
  metricsApp.use('/metrics', prometheusBundle.metricsMiddleware);
  metricsApp.listen(nconf.get('metrics:port'), () => {
    logger.info(`Prometheus metrics on port ${nconf.get('metrics:port')}!`);
  });
};

module.exports = {
  metricsServer, // Create metrics server
  expressRequest, // Register Express middleware
  prometheusClient, // Register custom metrics
};
