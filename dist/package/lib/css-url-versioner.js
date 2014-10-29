
/*
cssUrlVersioner
@class cssUrlVersioner
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var CssUrlVersioner, Execute, extend;

extend = require('util')._extend;

Execute = require('./execute.js');


/*
 * Library.
 */

CssUrlVersioner = function(settings) {
  this["default"] = {
    variable: 'v',
    lastCommit: true,
    date: false,
    formatDate: 'd-M-Y'
  };
  this.sha1 = null;
  this.version = null;
  this.queryString = null;
  this.options = extend(this["default"], settings);
  this.setDefaultVersion();
  if (this.options.lastCommit) {
    this.getLastCommit();
  }
  this.getQueryString();
  return this;
};

CssUrlVersioner.prototype.getLastCommit = function() {
  var command, exec;
  command = "git log -1 --format=%h";
  exec = new Execute();
  this.sha1 = exec.runCommand(command);
  console.log('sha1: ' + this.sha1);
};

CssUrlVersioner.prototype.setDefaultVersion = function() {
  var d;
  d = new Date();
  this.version = d.getFullYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString();
};

CssUrlVersioner.prototype.getQueryString = function() {
  if (this.options.lastCommit) {
    this.version = this.sha1;
  }
  this.queryString = '?' + this.options.variable + '=' + this.version;
};


/*
 * Expose library.
 */

module.exports = CssUrlVersioner;
