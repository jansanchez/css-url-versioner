###
cssUrlVersioner
@class cssUrlVersioner
@author Jan Sanchez
###

###
# Module dependencies.
###

extend  = require('util')._extend
Execute = require('./execute')
#fs      = require('fs')


###
# Library.
###

CssUrlVersioner = (settings) ->
	@default = {
		content: ''
		variable: 'v'
		version: ''
		lastcommit: false
	}
	@sha1 = null
	@version = null
	@queryString = null
	@output = null
	@options = extend(this.default, settings)

	@setDefaultVersion()
	if @options.lastcommit
		@getLastCommit()

	@getQueryString()

	@insertVersion()

	#console.log @queryString
	@


CssUrlVersioner::getLastCommit = () ->
	command = "git log -1 --format=%h"

	exec = new Execute()
	@sha1 = exec.runCommand(command)
	return

CssUrlVersioner::setDefaultVersion = () ->
	d = new Date()
	@version = d.getFullYear().toString() + (d.getMonth()+1).toString() + d.getDate().toString()
	return

CssUrlVersioner::getQueryString = () ->

	if @options.lastcommit
		@version = @sha1

	if @options.version isnt ''
		@version = @options.version	

	@queryString = '?' + @options.variable + '=' + @version
	return

CssUrlVersioner::insertVersion = () ->
	#console.log @options.content
	#(url)([\(]{1})([\"|\']?)([a-zA-Z0-9\@\.\/_-]+)([\#]?[a-zA-Z0-9_-]+)?([\"|\']?)([\)]{1})
	#@output
	return

###
# Expose library.
###

module.exports = CssUrlVersioner

