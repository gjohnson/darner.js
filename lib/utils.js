
/**
 * Turns k/v `opts` into a string delimitted
 * by "/". Mainly only used for SET options.
 *
 * TODO: Worth even having this here?
 *
 * @param {Object} opts
 * @return {String}
 * @api private
 */

exports.options = function(opts){
  var str = '';

  for (var key in opts) {
    str += '/' + key;
    if ('boolean' != typeof key[opts]) {
      str += '=' + opts[key];
    }
  }

  return str;
};