
/**
 * Deps.
 */

var Client = require('./client');

/**
 * Expose constructors.
 */

exports.Client = Client;

/**
 * Sugar for client initilization.
 *
 * @return {Client}
 * @see Client#connect()
 */

exports.connect = function(){
  var client = new Client();
  return client.connect.apply(client, arguments);
};