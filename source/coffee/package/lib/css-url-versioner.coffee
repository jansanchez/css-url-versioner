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

###
# Library.
###

CssUrlVersioner = (settings) ->
	@sha1 = null
	@version = null
	@queryString = null
	@output = ''

	@extend(settings)
	@generateVersion()
	@getQueryString()
	@insertVersion()

	@

CssUrlVersioner::extend = (settings) ->
	@default = {
		variable: 'v'
		version: ''
		lastcommit: false
	}
	@options = extend(this.default, settings)
	return

CssUrlVersioner::generateVersion = () ->
	if @options.version is ''
		@setDefaultVersion()
	else
		@version = @options.version
		@sha1 = @version
	if @options.lastcommit
		@getLastCommit()
	return

CssUrlVersioner::getLastCommit = () ->
	command = "git log -1 --format=%h"

	exec = new Execute()
	@sha1 = exec.runCommand(command)
	
	if @sha1 is 'error'
		@sha1 = @version

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

CssUrlVersioner::getQuote = (url, pattern) ->
	
	ArrayOfQuotes = url.match(pattern)
	quote = ""

	unless ArrayOfQuotes is null
		Quoutes = ArrayOfQuotes.slice(ArrayOfQuotes.length-1)
		quote = Quoutes[0]

	return quote

CssUrlVersioner::getNumeral = (url, pattern) ->

	ArrayOfNumerals = url.match(pattern)
	numeral = ""

	unless ArrayOfNumerals is null
		numerals = ArrayOfNumerals.slice(ArrayOfNumerals.length-1)
		numeral = numerals[0]

	return numeral

CssUrlVersioner::getExtension = (url, pattern, patternQuotes) ->

	ArrayOfExtensions = url.match(pattern)
	extensions = ArrayOfExtensions.slice(ArrayOfExtensions.length-1)

	extension = extensions[0].substr(1).replace(patternQuotes, '')

	return extension

CssUrlVersioner::getNewString = (numeral, quote, extension) ->

		if numeral is ""
			additionalSign = quote
		else
			additionalSign = numeral

		newString = '.' + extension + @queryString + additionalSign

		return newString

CssUrlVersioner::getTheLastPart = (quote, numeral, singleQuote, doubleQuotes, patternSimbols) ->

	theLastPartOfTheRegExp = ""
	
	if quote is ''
		unless numeral is ""
			theLastPartOfTheRegExp = patternSimbols.source
	else
		switch quote
			when '"'
				if numeral is ""
					theLastPartOfTheRegExp = doubleQuotes.source
				else
					theLastPartOfTheRegExp = patternSimbols.source
			when "'"
				if numeral is ""
					theLastPartOfTheRegExp = singleQuote.source
				else
					theLastPartOfTheRegExp = patternSimbols.source
	return theLastPartOfTheRegExp

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

		quote = @getQuote(url, patternQuotes)
		numeral = @getNumeral(url, patternSimbols)
		extension = @getExtension(url, patternExt, patternQuotes)
		newString = @getNewString(numeral, quote, extension)

		theLastPartOfTheRegExp = @getTheLastPart(quote, numeral, singleQuote, doubleQuotes, patternSimbols)

		newRegEx = new RegExp(dot.source + extension + theLastPartOfTheRegExp)

		@options.content = @options.content.replace(newRegEx, newString)
		
		# restart lastIndexs

		newRegEx.lastIndex = 0
		patternExt.lastIndex = 0
		patternQuotes.lastIndex = 0
		patternSimbols.lastIndex = 0
		dot.lastIndex = 0
		doubleQuotes.lastIndex = 0
		singleQuote.lastIndex = 0

	@output = @options.content

	return

###
# Expose library.
###

module.exports = CssUrlVersioner

