const AWS = require('aws-sdk');
const nconf = require('../config');
const logger = require('../logger');

const { Consumer } = require('sqs-consumer');
const metrics = require('./metrics');

const histogram = new metrics.prometheusClient.Histogram({
  name: `message_consumer`,
  help: 'duration histogram of message consumer with status',
  labelNames: ['statusCode'],
  buckets: [0.5, 1, 2, 5, 10, 20],
});

/**
 * Proccesses an SQS slot message
 *
 * @param {string} message - A gziped + base64 encoded message
 */
const processMessage = async (message) => {
  const labels = {};
  const timer = histogram.startTimer(labels);
  try {
    const promises = [];
    JSON.parse().forEach((event) => {
      console.log(event);
    });
    await Promise.all(promises);
    labels.statusCode = 200;
  } catch (err) {
    logger.info(
      `Failed SQS MessageId: ${message.MessageId} ,` +
      `Body: ${message.Body}, ` +
      `details: ${err.message}`
    );
    logger.error(
      `Failed SQS MessageId: ${message.MessageId} ,` +
      `details: ${err.message}`
    );
    labels.statusCode = 400;
    throw err;
  }
  timer();
};

AWS.config.update({ region: nconf.get('sqs:region') });

const createConsumer = function(visibilityTimeout) {
  const settings = { // eslint-disable-line
    queueUrl: nconf.get('sqs:queue_url'),
    batchSize: 10,
    handleMessage: async (message) => {
      /* An SQS message looks like:
        {
          MessageId: '084034b8-b4f8-40fb-8bf6-f513bee083ae',
          ReceiptHandle: base64 encoded string,
          MD5OfBody: '781cffb2f074654f62b677a4c25c9cf9',
          Body: 'actual message here'
        }
      */
      logger.debug(`Received a message with MessageId: ${message.MessageId}`);
      await processMessage(message);
    },
    sqs: new AWS.SQS(),
  };
  if (visibilityTimeout || visibilityTimeout === 0) {
    settings.visibilityTimeout = visibilityTimeout;
  }
  const messageConsumer = Consumer.create(settings);

  messageConsumer.on('error', (err) => { logger.error(err.message); });
  messageConsumer.on(
    'processing_error', (err) => { logger.error(err.message); }
  );
  messageConsumer.on('timeout_error', (err) => { logger.error(err.message); });
  return messageConsumer;
};

module.exports = { processMessage, createConsumer };
