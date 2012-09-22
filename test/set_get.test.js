
var darner = require('../')
  , should = require('should');

describe('set()', function(){
  it('should set the key', function(){
    var dc = darner.client(22133, 'localhost');

    dc.set('foo', 'bar');

    dc.get('foo', function(value){
      value.should.equal('bar');
      done();
    });

  });
});
