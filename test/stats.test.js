
var darner = require('../')
  , should = require('should');

describe('stats()', function(){
  var dc = darner.connect();

  it('should reply with k/v of server stats', function(done){
    dc.stats(function(err, stats){
      should.not.exist(err);
      stats.should.have.property('uptime');
      stats.should.have.property('time');
      stats.should.have.property('version');
      stats.should.have.property('curr_items');
      stats.should.have.property('total_items');
      stats.should.have.property('curr_connections');
      stats.should.have.property('total_connections');
      stats.should.have.property('cmd_get');
      stats.should.have.property('cmd_set');
      done();
    });

  });

});
