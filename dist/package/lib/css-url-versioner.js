
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

Execute = require('./execute');


/*
 * Library.
 */

CssUrlVersioner = function(settings) {
  this["default"] = {
    content: '',
    variable: 'v',
    version: '',
    lastcommit: false
  };
  this.sha1 = null;
  this.version = null;
  this.queryString = null;
  this.output = null;
  this.options = extend(this["default"], settings);
  this.setDefaultVersion();
  if (this.options.lastcommit) {
    this.getLastCommit();
  }
  this.getQueryString();
  this.insertVersion();
  return this;
};

CssUrlVersioner.prototype.getLastCommit = function() {
  var command, exec;
  command = "git log -1 --format=%h";
  exec = new Execute();
  this.sha1 = exec.runCommand(command);
};

CssUrlVersioner.prototype.setDefaultVersion = function() {
  var d;
  d = new Date();
  this.version = d.getFullYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString();
};

CssUrlVersioner.prototype.getQueryString = function() {
  if (this.options.lastcommit) {
    this.version = this.sha1;
  }
  if (this.options.version !== '') {
    this.version = this.options.version;
  }
  this.queryString = '?' + this.options.variable + '=' + this.version;
};

CssUrlVersioner.prototype.insertVersion = function() {};


/*
 * Expose library.
 */

module.exports = CssUrlVersioner;
