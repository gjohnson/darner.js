
var darner = require('../')
  , should = require('should');

describe('connection', function(){

  describe('connect() success', function(){
    it('should connect to darner with port and host', function(done){
      var dc = darner.client();

      dc.on('connect', function(){
        dc.should.have.property('connected', true);
        done();
      });

      dc.connect(22133, 'localhost');
    });
  });

  describe('connect() failure', function(){
    it('should emit an error', function(done){
      var dc = darner.client();

      dc.on('error', function(err){
        dc.should.have.property('connected', false);
        err.should.have.property('code', 'ECONNREFUSED');
        done();
      });

      dc.connect(99999, 'localhost');
    });
  });

  describe('client()', function(){
    it('should implicity connect when handing port & host', function(done){
      var dc = darner.client(22133, 'localhost');
      dc.on('connect', function(){
        dc.should.have.property('connected', true);
        done();
      });
    });
  });


});
