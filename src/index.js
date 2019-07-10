const server = require('./server');

// The service is started this way in order to able to test the routes
// without starting the server itself
server().then(app => {
  app.listen(8009, () => console.log(`Application is up and running!`));
});
