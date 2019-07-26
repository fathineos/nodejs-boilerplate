const yaml = require('js-yaml'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    nconf = require('nconf');

const env = process.env.NODE_ENV;

// Require that NODE_ENV is set
if (!['development', 'test', 'production'].includes(env)) {
  console.log(`Invalid value "${env}" for NODE_ENV. App cannot start.`);
  process.exit(1);
}

nconf.formats.yaml = require('nconf-yaml');

// Load configuration file based on NODE_ENV environment
console.log(`Loading config/${env}.yml`);
nconf.file({
  file: path.resolve(__dirname, `../config/${env}.yml`),
  format: nconf.formats.yaml,
});

// Load configuration from defaults.yml, for fields that are not
// set using previous configuration file
nconf.defaults(yaml.safeLoad(fs.readFileSync(
  path.resolve(__dirname, '../config/defaults.yml'), 'utf8')));

// Update some configuration settings so that they are read either
// from an environment variable or a file.
// For example:
//   secret: $MY_SECRET
// is read from MY_SECRET environment variable (e.g. for docker-compose) while
//   secret: /etc/secret
// is read from the /etc/secret file (e.g. for kubernetes secrets)
const settings = [];
_.each(settings, key => {
  const value = nconf.get(key);
  // read from environment variable or path
  if (value[0] == '$') {
    nconf.set(key, process.env[value.substr(1)]);
  } else if (value[0] == '/') {
    nconf.set(key, fs.readFileSync(value, 'utf8').trim());
  }
});

module.exports = nconf;
