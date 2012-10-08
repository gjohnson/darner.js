
/**
 * Deps.
 */

var debug = require('debug')('darner:parser');

/**
 * Expose `Parser`.
 */

module.exports = exports = Parser;

/**
 * Reply identifiers.
 *
 * @api private
 */

var identifiers = [
    'VALUE'
  , 'END'
  , 'STORED'
  , 'ERROR'
  , 'CLIENT_ERROR'
  , 'SERVER_ERROR'
  , 'STAT'
];


/**
 * Initialize a new parser.
 *
 * @api public
 */

function Parser(){
  this.chunkBuffer = '';
  this.lineBuffer = [];
  this.flushing = false;
  this.pattern = new RegExp('^(' + identifiers.join('|') + ')');
}

/**
 * Write chunks.
 *
 * @param {Buffer|String} chunk
 * @api private
 */

Parser.prototype.write = function(chunk){
  if (Buffer.isBuffer(chunk)) chunk = chunk.toString();

  var chunks = this.chunkBuffer += chunk
    , len = chunks.length
    , cr = chunks.charCodeAt(len - 2)
    , lf = chunks.charCodeAt(len - 1)
    , lines;

  if (cr == 13 && lf == 10) {
    chunks = chunks.substr(0, len - 2);
    lines = chunks.split('\r\n');

    for (var i = 0; i < lines.length; i++) {
      this.feed(lines[i]);
    }

    this.chunkBuffer = '';
  }
};

/**
 * Parse `line`.
 *
 * TODO: switch is probably too slow...
 *
 * @param {String} line
 * @api private
 */

Parser.prototype.feed = function(line){
  var match = line.match(this.pattern)
    , buff = this.lineBuffer
    , id = match && match[1];

  switch (id) {
    case 'STORED':
      this.storedReply();
      break;

    case 'ERROR':
    case 'CLIENT_ERROR':
    case 'SERVER_ERROR':
      this.errorReply(id, line);
      break;

    case 'VALUE':
    case 'STAT':
    case 'END':
    default:
      buff.push(line);
      if ('END' == line) {
        if (buff.length > 1) {
          this.flush();
        } else {
          this.valueReply(null);
        }
      }
  }
};

/**
 * Flushes the multi-line replies (VALUE and STAT for now).
 *
 * TODO: switch is probably too slow...
 *
 * @api private
 */

Parser.prototype.flush = function(){
  var buff = this.lineBuffer
    , start = buff[0]
    , id = start.split(' ')[0]
    , lines = buff.slice(0, buff.length - 1);

  this.lineBuffer = [];

  switch (id) {
    case 'VALUE':
      this.valueReply(lines);
      break;

    case 'STAT':
      this.statReply(lines);
      break;

    default:
      debug('uh oh... -- %s', id);
  }
};

/**
 * "VALUE" line reply.
 *
 * @param {Array|Null} lines
 * @api private
 */

Parser.prototype.valueReply = function(lines){
  if (lines === null) return this.onReply(null, null);

  var head = lines[0]
    , bytes = lines[1]
    , len = head.split(' ')[3];

  this.onReply(null, bytes.substr(0, len));
};

/**
 * "STAT" line reply.
 *
 * @param {Array} lines
 * @api private
 */

Parser.prototype.statReply = function(lines){
  var map = {}
    , parts;

  for (var i = 0; i < lines.length; i++) {
    parts = lines[i].split(' ');
    map[parts[1]] = parts[2];
  }

  this.onReply(null, map);
};

/**
 * "STORED" line reply.
 *
 * @api private
 */

Parser.prototype.storedReply = function(){
  this.onReply(null, true);
};

/**
 * "ERROR"/"CLIENT_ERROR"/"SERVER_ERROR" line reply.
 *
 * @param {String} id
 * @param {String} line
 * @api private
 */

Parser.prototype.errorReply = function(id, line){
  line = 'ERROR' == line
    ? 'unknown error'
    : line.replace(id + ' ', '');

  this.onReply(new Error(line));
};

/**
 * Stub for attaching `onReply` handler. Keeps
 * this lighter weight than making the parser
 * an event emitter.
 *
 * @api public
 */

Parser.prototype.onReply = function(){};