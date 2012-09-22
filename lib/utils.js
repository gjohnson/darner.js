
exports.options = function(opts){
  var str = '';

  for (var key in opts) {
    str += '/' + key;
    if ('boolean' != typeof key[opts]) {
      str += '=' + opts[key];
    }
    str += '/';
  }

  return str;
};