
/*
index
@class index
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var Versioner;

Versioner = require('./lib/css-url-versioner');


/*
 * Expose library.
 */

module.exports = function(options) {
  var cssUrlVersioner;
  cssUrlVersioner = new Versioner(options);
  return cssUrlVersioner;
};
