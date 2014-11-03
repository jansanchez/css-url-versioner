
/*
Javascript function for exec linux commands in nodejs
@class Execute
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var Execute, execute, extend, fs, rimraf;

extend = require('util')._extend;

execute = require("child_process").exec;

fs = require('fs');

rimraf = require('rimraf');


/*
 * Library.
 */

Execute = function(settings) {
  this.reset();
  return this;
};

Execute.prototype.runCommand = function(command) {
  var newCommand;
  newCommand = command + " 2>&1 1>output && echo done > done";
  execute(newCommand);
  this.validateOutput(command);
  return this.output;
};

Execute.prototype.validateOutput = function(command) {
  this.readFile();
  if (this.output === '') {
    console.log('esto llega a pasar en algun momento?');
    this.runCommand(command);
  }
  this.reset();
};

Execute.prototype.readFile = function() {
  var flag;
  flag = true;
  this.output = 'error';
  while (!fs.existsSync('./done')) {
    this.attempts++;
    if (this.attempts > 250) {
      flag = false;
      break;
    }
  }
  this.validateFlag(flag);
};

Execute.prototype.validateFlag = function(flag) {
  if (flag) {
    this.output = fs.readFileSync('./output', {
      encoding: 'utf8'
    }).toString().replace(/\n/gi, '');
  }
};

Execute.prototype.reset = function() {
  rimraf('./done', function() {});
  rimraf('./output', function() {});
  this.attempts = 0;
};


/*
 * Expose library.
 */

module.exports = Execute;
