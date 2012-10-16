
var darner = require('../')
  , should = require('should');

describe('reliable', function(){

  describe('open', function(){
    it('should leave the item on the queue', function(done){
      var dc = darner.connect();

      dc.set('jobs', 'work', function(){
        dc.get('jobs', { open: true }, function(err, value){
          should.not.exist(err);
          value.should.equal('work');
          dc.quit();

          // reconnect
          dc = darner.connect();
          dc.get('jobs', { open: true, close: true }, function(err, value){
            dc.quit();
            value.should.equal('work');
            done();
          });
        });
      });
    });
  });
});
