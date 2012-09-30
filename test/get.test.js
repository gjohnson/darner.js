
var darner = require('../')
  , should = require('should');

describe('get()', function(){
  var dc = darner.connect(22133, 'localhost');

  describe('empty', function(){
    it('should reply with nothing', function(done){
      dc.get('awesome', function(err, res){
        res.should.equal('END');
        done();
      });
    });
  });

  describe('wait', function(){
    it('should wait 50 ms', function(){
      var result = '';

      dc.get('awesome', { t: 50 }, function(err, res){
        result = res;
      });

      setTimeout(function(){
        result.should.equal('');
      }, 25);

      setTimeout(function(){
        result.should.equal('END');
        done();
      }, 50);
    });
  });

});
