const express = require('express');
const healthRouter = require('./routes/health');

module.exports = async () => {
  const app = express();
  app.use('/health', healthRouter.router);

  return app;
};
