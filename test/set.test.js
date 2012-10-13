
var darner = require('../')
  , should = require('should');

describe('set()', function(){
  var dc = darner.connect();

  describe('empty', function(){
    dc.set('work', 'item 1', function(){
      dc.get('work', function(err, work){
        work.should.equal('item 1');
        dc.get('work', function(err, work){
          should.not.exist(work);
        });
      });
    });
  });

});
