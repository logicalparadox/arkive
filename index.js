module.exports = process.env.arkive_COV
  ? require('./lib-cov/arkive')
  : require('./lib/arkive');
