###
Javascript function for exec linux commands in nodejs
@class Execute
@author Jan Sanchez
###

###
# Module dependencies.
###

extend  = require('util')._extend
execute = require("child_process").exec
fs      = require('fs')
rimraf  = require('rimraf')

###
# Library.
###

Execute = (settings) ->
	@doneFile   = 'done'
	@outputFile = 'output'
	@pathDone   = process.cwd() + '/' + @doneFile
	@pathOutput = process.cwd() + '/' + @outputFile
	@attempts   = 0
	@

Execute::runCommand = (command) ->
	newCommand = command + " 2>&1 1> " + @outputFile + " && echo done > " + @doneFile

	execute(newCommand)
	@readFile()
	@reset()
	return @output

Execute::readFile = () ->
	flag = true
	@output = 'error'

	while (!fs.existsSync(@pathDone))
		@attempts++
		if @attempts > 300
			flag = false
			break

	return @validateFlag(flag)

	


Execute::validateFlag = (flag) ->
	if flag
		try
			@output = fs.readFileSync(@pathOutput, {encoding: 'utf8'}).toString().replace(/\n/gi, '')
			return true
		catch e
			#console.log('validateFlag')
			#console.log(e)
	else
		return false
	return

Execute::reset = () ->
	try
		rimraf(@pathDone, () ->
			return
		)
		rimraf(@pathOutput, () ->
			return
		)
	catch e
		#console.log('reset')
		console.log(e)
	
	@attempts = 0
	return true

###
# Expose library.
###

module.exports = Execute

