
/**
 * Module dependencies.
 */

var express = require('express')
, fs = require('fs');

var app = module.exports = express.createServer();

// Configuration

//var static_dir = __dirname + '/../client-build';
var static_dir = __dirname + '/../client';
//var index = fs.readFileSync(__dirname+'/../client-build/index.html', 'utf8');
var index = fs.readFileSync(__dirname+'/../client/index.html', 'utf8');
var gametypes = fs.readFileSync(__dirname+'/../shared/js/gametypes.js', 'utf8');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  console.log('serving static from ', static_dir);
  app.use(express.static(static_dir));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  res.end(index);
});
app.get('/shared/js/gametypes.js', function(req, res){
  res.end(gametypes);
});
app.listen(8001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
