const _ = require('lodash');
const winston = require('winston');
const Sentry = require('winston-sentry-raven-transport');

const nconf = require('./config');
const transports = [];
const logsFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DDTHH:mm:ssZ',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

_.each(nconf.get('log:transports'), (options, name) => {
  // Transports in winston are declared in pascalCase
  const Transport = winston.transports[_.upperFirst(_.camelCase(name))];
  if (!Transport) {
    throw Error(`Unknown winston transport: ${name}`);
  }
  transports.push(new Transport(
    Object.assign({ format: logsFormat }, options)
  ));
});

const env = process.env.NODE_ENV;
if (env === 'production') {
  const options = {
    level: 'error',
    dsn: '',
    install: true,
    config: {
      captureUnhandledRejections: true,
    },
  };

  transports.push(new Sentry(options));
}

module.exports = winston.createLogger({
  defaultMeta: {
    service: nconf.get('app:name'),
    environment: process.env.NODE_ENV,
  },
  transports: transports,
  silent: nconf.get('log:silent'),
});
