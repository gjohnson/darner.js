

var Client = require('./client');

exports.client = function(port, host, cb){
  var client = new Client();
  if (arguments.length) client.connect.apply(client, arguments);
  return client;
};