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

###
# Library.
###

Execute = (settings) ->
	@

Execute::runCommand = (command) ->
	that = @

	newCommand = command + " 2>&1 1>output && echo done > done"
	exec = execute(newCommand)

	while (!fs.existsSync('./done'))
		console.log('. . no existe! done . .')

	console.log('. . ya existe! . .')

	@output = fs.readFileSync('./output', {encoding: 'utf8'}).toString().replace(/\n/gi, '')

#	if @output is '' or (typeof @output is undefined) or @output is 'done'
#		that.runCommand(newCommand)	

	console.log '_'+@output+'_'

	return @output

###
# Expose library.
###

module.exports = Execute

