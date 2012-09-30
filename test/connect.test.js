
var darner = require('../')
  , should = require('should');

describe('connection', function(){

  describe('connect() success', function(){
    it('should connect to darner with port and host', function(done){
      var dc = darner.connect();

      dc.on('connect', function(){
        dc.should.have.property('connected', true);
        done();
      });
    });
  });

  describe('connect() failure', function(){
    it('should emit an error', function(done){
      var dc = darner.connect(99999, 'localhost');

      dc.on('error', function(err){
        dc.should.have.property('connected', false);
        err.should.have.property('code', 'ECONNREFUSED');
        done();
      });
    });
  });

  describe('client()', function(){
    it('should implicity connect when handing port & host', function(done){
      var dc = darner.connect(22133, 'localhost');
      dc.on('connect', function(){
        dc.should.have.property('connected', true);
        done();
      });
    });
  });


});
