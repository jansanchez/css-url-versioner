###
cssUrlVersioner
@class cssUrlVersioner
@author Jan Sanchez
###

###
# Module dependencies.
###

extend  = require('util')._extend
Execute = require('./execute.js')
#execute = require("child_process").exec
#fs      = require('fs')


###
# Library.
###

CssUrlVersioner = (settings) ->
	@default = {
		variable: 'v',
		lastCommit: true,
		date: false,
		formatDate: 'd-M-Y'
	}
	@sha1 = null
	@version = null
	@queryString = null
	@options = extend(this.default, settings)

	@setDefaultVersion()
	if @options.lastCommit
		@getLastCommit()
	@getQueryString()

	#console.log @queryString
	@


CssUrlVersioner::getLastCommit = () ->
	command = "git log -1 --format=%h"

	exec = new Execute()
	@sha1 = exec.runCommand(command)
	console.log('sha1: ' + @sha1)
	return

CssUrlVersioner::setDefaultVersion = () ->
	d = new Date()
	#d.getHours().toString() + "-"+ d.getMinutes().toString()
	@version = d.getFullYear().toString() + (d.getMonth()+1).toString() + d.getDate().toString()
	return

CssUrlVersioner::getQueryString = () ->
	if @options.lastCommit
		@version = @sha1

	@queryString = '?' + @options.variable + '=' + @version
	return



###
# Expose library.
###

module.exports = CssUrlVersioner

