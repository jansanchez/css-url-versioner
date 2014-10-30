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

	#console.log @options.content

	patternExt = /(url)([\(]{1})([\"|\']?)([a-zA-Z0-9\@\.\/_-]+)([\#]?[a-zA-Z0-9_-]+)?([\"|\']?)([\)]{1})/g;
	arrString = @options.content.match(patternExt)
	#console.log arrString

	patternImgExt = /\.(png|jpg|jpeg|gif)(\"|\')/g

	for url, i in arrString
		console.log url

		

		###
		patternString = arrString[i].toString()
		comilla   = patternString.substr(patternString.length-1)
		extension = patternString.substr(1, patternString.length-2)
		newString = "." + extension + "?version"+comilla

		console.log("comilla: "+comilla+"\n")
		console.log("extension: "+extension+"\n")
		console.log("newString: "+newString+"\n")

		dot = /\./
		comillaDoble  = /\"/
		comillaSimple = /\'/

		if (comilla is '"')
			newRegEx = new RegExp(dot.source + extension + comillaDoble.source)
		else
			newRegEx = new RegExp(dot.source + extension + comillaSimple.source)
		

		newFileContent = @options.content.replace(newRegEx, newString)
		
		console.log newFileContent

		newRegEx.lastIndex = 0
		patternExt.lastIndex = 0
		###


	return

###
# Expose library.
###

module.exports = CssUrlVersioner

