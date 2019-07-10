const _ = require('lodash');
const fs = require('fs');
const nconf = require('nconf');
const path = require('path');
const yaml = require('js-yaml');

const env = process.env.NODE_ENV;

// Require that NODE_ENV is set
if (!['development', 'test', 'production'].includes(env)) {
  throw Error(
    `Invalid value "${env}" for NODE_ENV. App cannot start.`
  );
}

nconf.formats.yaml = require('nconf-yaml');

// Load configuration file based on
// 1) Command-line arguments
// 2) File named with NODE_ENV environment,
// 3) Environment variables.
// 4) File with default values
// The environment variables will be transformed to lowercase and '__'
// will be replaced with ':'.
// For example DATABASE__URL => database.url
nconf.argv().file({
  file: path.resolve(__dirname, `../config/${env}.yml`),
  format: nconf.formats.yaml,
}).env({
  separator: '__',
  lowerCase: true,
}).defaults(yaml.safeLoad(fs.readFileSync(
  path.resolve(__dirname, '../config/defaults.yml'), 'utf8'))
);

// This is a way to distinguise environment variables from file secrets in AWS.
// Add the config path in the replaceableValues and in case the value starts
// with `$` will be treated as an environment value, if starts with `/` that
// means it's going to be treated as a file and will be read from disk.

const replaceableValues = [];

_.each(replaceableValues, item => {
  let value = nconf.get(item);
  if (value[0] == '$') {
    nconf.set(item, process.env[value.substr(1)]);
  } else if (value[0] == '/') {
    nconf.set(item, fs.readFileSync(value, 'utf8').trim());
  }
});

module.exports = nconf;
