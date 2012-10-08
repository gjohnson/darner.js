
module.exports = exports = process.env.DARNER_COV
  ? require('./lib-cov/darner')
  : require('./lib/darner');