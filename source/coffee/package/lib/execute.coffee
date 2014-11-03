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

	execute(newCommand)
	@readFile()
	@reset()
	return @output

Execute::readFile = () ->
	flag = true
	@output = 'error'

	while (!fs.existsSync('./done'))
		@attempts++
		if @attempts > 250
			flag = false
			break
	
	@validateFlag(flag)

	return


Execute::validateFlag = (flag) ->
	if flag
		@output = fs.readFileSync('./output', {encoding: 'utf8'}).toString().replace(/\n/gi, '')
	return

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

