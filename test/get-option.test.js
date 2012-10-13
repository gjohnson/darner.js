
var darner = require('../')
  , should = require('should');

describe('get() w/ options', function(){
  var dc = darner.connect();

  describe('/t=ms', function(){
    it('should wait 25 ms before reply', function(done){
      dc.get('work', { t: 25 }, function(err, res){
        should.not.exist(err);
        should.not.exist(res);
        done();
      });
    });
  });

});
