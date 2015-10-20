
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
  this.doneFile = 'done';
  this.outputFile = 'output';
  this.pathDone = process.cwd() + '/' + this.doneFile;
  this.pathOutput = process.cwd() + '/' + this.outputFile;
  return this;
};

Execute.prototype.runCommand = function(command) {
  var newCommand;
  newCommand = command + " 2>&1 1> " + this.outputFile + " && echo done > " + this.doneFile;
  execute(newCommand);
  this.readFile();
  this.reset();
  return this.output;
};

Execute.prototype.readFile = function() {
  var flag;
  flag = true;
  this.output = 'error';
  while (!fs.existsSync(this.pathDone)) {
    this.attempts++;
    if (this.attempts > 300) {
      flag = false;
      break;
    }
  }
  return this.validateFlag(flag);
};

Execute.prototype.validateFlag = function(flag) {
  var e, error;
  if (flag) {
    try {
      this.output = fs.readFileSync(this.pathOutput, {
        encoding: 'utf8'
      }).toString().replace(/\n/gi, '');
      return true;
    } catch (error) {
      e = error;
    }
  } else {
    return false;
  }
};

Execute.prototype.reset = function() {
  var e, error;
  try {
    rimraf(this.pathDone, function() {});
    rimraf(this.pathOutput, function() {});
  } catch (error) {
    e = error;
    console.log(e);
  }
  this.attempts = 0;
  return true;
};


/*
 * Expose library.
 */

module.exports = Execute;
