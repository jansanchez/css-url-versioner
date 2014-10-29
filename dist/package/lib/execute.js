
/*
Javascript function for exec linux commands in nodejs
@class Execute
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var Execute, execute, extend, fs;

extend = require('util')._extend;

execute = require("child_process").exec;

fs = require('fs');


/*
 * Library.
 */

Execute = function(settings) {
  return this;
};

Execute.prototype.runCommand = function(command) {
  var exec, newCommand, that;
  that = this;
  newCommand = command + " 2>&1 1>output && echo done > done";
  exec = execute(newCommand);
  while (!fs.existsSync('./done')) {
    console.log('. . no existe! done . .');
  }
  console.log('. . ya existe! . .');
  this.output = fs.readFileSync('./output', {
    encoding: 'utf8'
  }).toString().replace(/\n/gi, '');
  console.log('_' + this.output + '_');
  return this.output;
};


/*
 * Expose library.
 */

module.exports = Execute;
