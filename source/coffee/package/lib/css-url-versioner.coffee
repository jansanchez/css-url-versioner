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
		variable: 'v'
		version: ''
		lastcommit: false
	}
	@options = extend(this.default, settings)

	@sha1 = null
	@version = null
	@queryString = null
	@output = ''

	@setDefaultVersion()
	if @options.lastcommit
		@getLastCommit()

	@getQueryString()
	@insertVersion()

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
	patternQuotes = /(\"|\')/g
	patternExt = /(\.{1}[a-zA-Z0-9]{2,4})(\"|\')?/g
	patternSimbols = /([\#]{1})/g

	doubleQuotes  = /\"/
	singleQuote = /\'/
	dot = /\./

	arrayUrl = @options.content.match(patternUrl)

	for url in arrayUrl
		quote = ""
		numeral = ""

		ArrayOfQuotes = url.match(patternQuotes)

		unless ArrayOfQuotes is null
			Quoutes = ArrayOfQuotes.slice(ArrayOfQuotes.length-1)
			quote = Quoutes[0]

		ArrayOfNumerals = url.match(patternSimbols)

		unless ArrayOfNumerals is null
			numerals = ArrayOfNumerals.slice(ArrayOfNumerals.length-1)
			numeral = numerals[0]

		ArrayOfExtensions = url.match(patternExt)
		extensions = ArrayOfExtensions.slice(ArrayOfExtensions.length-1)

		extension = extensions[0].substr(1).replace(patternQuotes, '')

		if numeral is ""
			newString = '.' + extension + @queryString + quote
		else
			newString = '.' + extension + @queryString + numeral

		if quote is ''
			if numeral is ""
				newRegEx = new RegExp(dot.source + extension)
			else
				newRegEx = new RegExp(dot.source + extension + patternSimbols.source)			
		else
			switch quote
				when '"'
					if numeral is ""
						newRegEx = new RegExp(dot.source + extension + doubleQuotes.source)
					else
						newRegEx = new RegExp(dot.source + extension + patternSimbols.source)
				when "'"
					if numeral is ""
						newRegEx = new RegExp(dot.source + extension + singleQuote.source)
					else
						newRegEx = new RegExp(dot.source + extension + patternSimbols.source)

		@options.content = @options.content.replace(newRegEx, newString)
		@output = @options.content
		
		# restart lastIndexs

		newRegEx.lastIndex = 0
		patternExt.lastIndex = 0
		patternQuotes.lastIndex = 0
		patternSimbols.lastIndex = 0
		dot.lastIndex = 0
		doubleQuotes.lastIndex = 0
		singleQuote.lastIndex = 0

	return


###
# Expose library.
###

module.exports = CssUrlVersioner

