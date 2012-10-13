
var darner = require('../')
  , should = require('should');

describe('get()', function(){
  var dc = darner.connect();

  describe('empty', function(){
    it('should reply with null', function(done){
      dc.get('awesome', function(err, value){
        should.not.exist(err);
        dc.quit();
        done();
      });
    });
  });

});
