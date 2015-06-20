###
index
@class index
@author Jan Sanchez
###

###
# Module dependencies.
###

Versioner = require('./lib/css-url-versioner')

###
# Expose library.
###

module.exports = (options) ->
	cssUrlVersioner = new Versioner(options)
	cssUrlVersioner