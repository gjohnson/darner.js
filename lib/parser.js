

module.exports = Parser;

function Parser(){}

Parser.prototype.onreply = function(){};

Parser.prototype.write = function(chunk){
  this.onreply(chunk.slice(0, chunk.length - 2).toString());
};

