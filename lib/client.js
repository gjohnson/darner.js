
/**
 * Deps.
 */

var EE = require('events').EventEmitter
  , net = require('net')
  , Parser = require('./parser')
  , debug = require('debug')('darner')
  , utils = require('./utils');

/**
 * Expose `Client`.
 */

module.exports = Client;

/**
 * Intializes a new `Client`.
 *
 * Events:
 *
 *  - error
 *  - connect
 *  - close
 */

function Client(){
  this.port = 22133;
  this.host = 'localhost';
  this.connected = false;
  this.socket = null;
  this.callbacks = [];
  this.noop = function(){};
  this.parser = new Parser();
  this.parser.onReply = this.onReply.bind(this);
}

/**
 * Extends `EE`.
 */

Client.prototype.__proto__ = EE.prototype;

/**
 * Reply handler.
 *
 * TODO: actually handle errors correctly.
 *
 * @param {Buffer} buff
 * @api private
 */

Client.prototype.onReply = function(err, reply){
  debug('reply -- %s', reply);
  var cb = this.callbacks.shift();
  cb(err, reply);
};

/**
 * Writes a "line" to the `socket`.
 *
 * @api private
 */

Client.prototype.send = function(){
  var args = [];

  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }

  var line = args.join(' ') + '\r\n';

  debug('line -- %s', line);
  this.socket.write(line);
};

/**
 * "STATS".
 *
 * @param {Function} cb
 * @api public
 */

Client.prototype.stats = function(cb){
  this.callbacks.push(cb || this.noop);
  this.send('stats');
};

/**
 * `GET <queue-name>[options]`
 *
 * Options:
 *
 *    `t`     - Milliseconds to wait for an item on the queue.
 *    `open`  - Tenatively remove an item, fully removed after `close` is sent.
 *    `close` - Closes a previously `open` commands.
 *    `abort` - Cancels any previously `open` commands.
 *    `peek`  - Returns first item from the queue without removing it.
 *
 * @param {String} key
 * @param {Object|Undefined} opts
 * @param {Function} cb
 * @api public
 */

Client.prototype.get = function(key, opts, cb){
  if ('function' == typeof opts) cb = opts, opts = null;
  opts = opts ? utils.options(opts) : '';
  this.callbacks.push(cb || this.noop);
  this.send('get', key + opts);
};

/**
 * `SET <queue-name> <flags (ignored)> <expiration> <# bytes>`
 *
 * TODO: How to handle undefined "data" ?
 *
 * @param {String} key
 * @param {Mixed} data
 * @param {Object|Undefined} opts
 * @param {Function} cb
 * @api public
 */

Client.prototype.set = function(key, data, opts, cb){
  if ('function' == typeof opts) cb = opts, opts = {};
  if ('undefined' == typeof data) return;

  var expires = opts.expires || 0
    , flags = 0
    , len = Buffer.byteLength(data);

  this.callbacks.push(cb || this.noop);
  this.send('set', key, flags, expires, len);
  this.send(data);
};

/**
 * Connect to `port` and `host`. Optionally invoke `cb`.
 *
 * TODO: reconnections.
 *
 * @param {Number} port
 * @param {String} host
 * @param {Function} cb
 * @api public
 */

Client.prototype.connect = function(port, host, cb){
  var self = this;
  var socket = this.socket = new net.Socket();

  this.port = port = port || 22133;
  this.host = host = host || 'localhost';

  socket.setNoDelay();

  socket.ondata = function(buff, offset, end){
    self.parser.write(buff.slice(offset, end));
  };

  socket.on('error', function(err){
    self.emit('error', err);
  });

  socket.on('close', function(){
    self.connected = false;
    debug('close');
    if (self.closing) return self.emit('close');
  });

  socket.on('connect', function(){
    self.connected = true;
    self.emit('connect');
    debug('connect');
    cb && cb();
  });

  socket.connect(port, host);

  return this;
};

/**
 * Closes connections to socket.
 *
 * @param {Function} cb
 * @api public
 */

Client.prototype.quit = function(cb){
  this.socket.destroy();
};
