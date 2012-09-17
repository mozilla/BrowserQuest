var connect = require('connect');

var app = connect()

  // Display incoming requests, coloured for status
  .use(connect.logger('dev'))

  // Serve everything in the client subdir statically
  .use(connect.static('client'))

  // This lets us return and log 404's, which is
  // very useful for debugging configuration problems
  .use(function(err, req, res, next){})

  // The tcp port to listen on
  .listen(8080);

console.log('BrowserQuest client server started on port '+8080);
