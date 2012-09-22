
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
  this.stack = [];
  this.noop = function(){};
  this.parser = new Parser();
  this.parser.onreply = this.onreply.bind(this);
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

Client.prototype.onreply = function(buff){
  var cb = this.stack.shift()
    , str = buff.toString()
    , err = undefined;

  if ('ERROR' == str) {
    err = new Error(str);
  }

  cb(err || null, str);
};

/**
 * Writes a "line" to the `socket`.
 *
 * @api private
 */

Client.prototype.write = function(){
  var args = new Array(arguments.length);

  for (var i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }

  this.socket.write(args.join(' ') + '\r\n');
};

/**
 * "STATS".
 *
 * @param {Function} cb
 * @api public
 */

Client.prototype.stats = function(cb){
  this.stack.push(cb || this.noop);
  this.write('stats');
};

/**
 * "GET <key>[options]".
 *
 * @param {String} key
 * @param {Function} cb
 * @api public
 */

Client.prototype.get = function(key, opts, cb){
  if ('function' == typeof opts) cb = opts, opts = {};
  opts = utils.options(opts);
  this.stack.push(cb || this.noop);
  this.write('get', key + opts);
};

/**
 * "SET <key> <value>".
 *
 * @param {String} key
 * @param {Mixed} data
 * @param {Function} cb
 * @api public
 */

Client.prototype.set = function(key, data, cb){
  this.stack.push(cb || this.noop);
  this.write('set', key, 0, 0, Buffer.byteLength(data));
  this.write(data);
};

/**
 * Connect to `port` and `host`. Optionally invoke `cb`.
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
};
