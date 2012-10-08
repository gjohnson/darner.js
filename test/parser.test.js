

var Parser = require('../lib/parser')
  , should = require('should');

describe('Parser', function(){

  var parser;

  beforeEach(function(){
    parser = new Parser();
  });

  describe('STORED', function(){
    it('should reply with "true"', function(done){
      parser.onReply = function(err, reply){
        should.not.exist(err);
        reply.should.be.ok;
        done();
      };
      parser.write('STORED\r\n');
    });
  });

  describe('VALUE', function(){
    it('should reply with "bar"', function(done){
      parser.onReply = function(err, reply){
        should.not.exist(err);
        reply.should.equal('bar');
        done();
      };
      parser.write('VALUE foo 0 3\r\n');
      parser.write('bar\r\n');
      parser.write('END\r\n');
    });
  });

  describe('ERROR', function(){
    it('should be an "unkown error"', function(done){
      parser.onReply = function(err){
        err.should.be.instanceof(Error);
        err.message.should.equal('unknown error');
        done();
      };
      parser.write('ERR');
      parser.write('O');
      parser.write('R\r\n');
    });
  });

  describe('CLIENT_ERROR', function(){
    it('should have an error message of "client oops!"', function(done){
      parser.onReply = function(err){
        err.should.be.instanceof(Error);
        err.message.should.equal('client oops!');
        done();
      };
      parser.write('CLIENT_');
      parser.write('ERROR client oops!\r\n');
    });
  });

  describe('SERVER_ERROR', function(){
    it('should have an error message of "ahhhh"', function(done){
      parser.onReply = function(err){
        err.should.be.instanceof(Error);
        err.message.should.equal('ahhhh');
        done();
      };
      parser.write('SERVER_ERROR ahhhh\r\n');
    });
  });

  describe('STAT', function(){
    it('should reply with multiple lines', function(done){
      parser.onReply = function(err, stats){
        should.not.exist(err);
        stats.should.have.property('uptime', '20');
        stats.should.have.property('time', '1349613631');
        stats.should.have.property('version', '0.1.4');
        done();
      };
      parser.write('STAT uptime 20\r\nSTAT time 1349613631\r\n');
      parser.write('STAT ');
      parser.write('version 0.1.4\r\n');
      parser.write('END\r\n');
    });
  });

});