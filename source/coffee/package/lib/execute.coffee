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
	@reset()
	@

Execute::runCommand = (command) ->
	newCommand = command + " 2>&1 1>output && echo done > done"
	exec = execute(newCommand)
	@readFile(command)
	if @output is ''
		@runCommand(command)
	@reset()
	return @output

Execute::readFile = () ->
	while (!fs.existsSync('./done'))
		@attempts++

	@output = fs.readFileSync('./output', {encoding: 'utf8'}).toString().replace(/\n/gi, '')
	return
	#console.log @attempts


Execute::reset = () ->
	rimraf('./done', ()->
		return
	)
	rimraf('./output', ()->
		return
	)
	@attempts = 0
	return

###
# Expose library.
###

module.exports = Execute

