
/*
cssUrlVersioner
@class cssUrlVersioner
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var CssUrlVersioner, execute, extend, fs;

extend = require('util')._extend;

execute = require("child_process").exec;

fs = require('fs');


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
  console.log(this.queryString);
  return this;
};

CssUrlVersioner.prototype.getLastCommit = function() {
  var command, that;
  that = this;
  command = "git log -1 --format=%h";
  execute(command + " 2>&1 1>output && echo done > done");
  while (!fs.existsSync('done')) {
    that.getLastCommit();
    return;
  }
  this.sha1 = fs.readFileSync('./output', {
    encoding: 'utf8'
  }).toString().replace(/\n/gi, '');
  if (this.sha1 === '') {
    that.getLastCommit();
  }
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
