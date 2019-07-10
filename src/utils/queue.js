const AWS = require('aws-sdk');
const nconf = require('../config');

async function GetMessagesCount() {
  const sqs = new AWS.SQS({ region: nconf.get('sqs:region') });
  const result = await sqs.getQueueAttributes({
    QueueUrl: nconf.get('sqs:queue_url'),
    AttributeNames: ['ApproximateNumberOfMessages'],
  }).promise();
  return parseInt(result.Attributes.ApproximateNumberOfMessages);
};

module.exports = { GetMessagesCount };
