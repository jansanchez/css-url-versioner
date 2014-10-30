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

	console.log @options.content

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

	patternUrl = /url([\(]{1})([\"|\']?)([a-zA-Z0-9\@\.\/_-]+)([\#]?[a-zA-Z0-9_-]+)?([\"|\']?)([\)]{1})/g
	arrString = @options.content.match(patternUrl)

	patternComillas = /(\"|\')/g
	patternExt = /(\.{1}[a-zA-Z0-9]{2,4})(\"|\')?/g
	patternSimbols = /([\#]{1})/g

	comillaDoble  = /\"/
	comillaSimple = /\'/
	dot = /\./

	for url in arrString
		comilla = ""
		almohadilla = ""

		patternString = url.toString()

		c1 = url.match(patternComillas)

		unless c1 is null
			c2 = c1.slice(c1.length-1)
			comilla = c2[0]

		c3 = url.match(patternSimbols)

		unless c3 is null
			c4 = c3.slice(c3.length-1)
			almohadilla = c4[0]

		newArr = url.match(patternExt)
		newArr2 = newArr.slice(newArr.length-1)

		extension = newArr2[0].substr(1).replace(patternComillas, '')

		if almohadilla is ""
			newString = '.' + extension + @queryString + comilla
		else
			newString = '.' + extension + @queryString + almohadilla

		if comilla is ''
			if almohadilla is ""
				newRegEx = new RegExp(dot.source + extension)
			else
				newRegEx = new RegExp(dot.source + extension + patternSimbols.source)			
		else
			switch comilla
				when '"'
					if almohadilla is ""
						newRegEx = new RegExp(dot.source + extension + comillaDoble.source)
					else
						newRegEx = new RegExp(dot.source + extension + patternSimbols.source)
				when "'"
					if almohadilla is ""
						newRegEx = new RegExp(dot.source + extension + comillaSimple.source)
					else
						newRegEx = new RegExp(dot.source + extension + patternSimbols.source)

		newFileContent = @options.content.replace(newRegEx, newString)
		@options.content = newFileContent

		# restart lastIndexs

		newRegEx.lastIndex = 0
		patternExt.lastIndex = 0
		patternComillas.lastIndex = 0
		patternSimbols.lastIndex = 0
		dot.lastIndex = 0
		comillaDoble.lastIndex = 0
		comillaSimple.lastIndex = 0

	return


###
# Expose library.
###

module.exports = CssUrlVersioner

