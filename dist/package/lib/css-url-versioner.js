
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
    variable: 'v',
    version: '',
    lastcommit: false
  };
  this.options = extend(this["default"], settings);
  this.sha1 = null;
  this.version = null;
  this.queryString = null;
  this.output = '';
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
  if (this.sha1 === 'error') {
    this.sha1 = this.version;
  }
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

CssUrlVersioner.prototype.insertVersion = function() {
  var ArrayOfExtensions, ArrayOfNumerals, ArrayOfQuotes, Quoutes, arrayUrl, dot, doubleQuotes, extension, extensions, newRegEx, newString, numeral, numerals, patternExt, patternQuotes, patternSimbols, patternUrl, quote, singleQuote, url, _i, _len;
  patternUrl = /url([\(]{1})([\"|\']?)([a-zA-Z0-9\@\.\/_-]+)([\#]?[a-zA-Z0-9_-]+)?([\"|\']?)([\)]{1})/g;
  patternQuotes = /(\"|\')/g;
  patternExt = /(\.{1}[a-zA-Z0-9]{2,4})(\"|\')?/g;
  patternSimbols = /([\#]{1})/g;
  doubleQuotes = /\"/;
  singleQuote = /\'/;
  dot = /\./;
  arrayUrl = this.options.content.match(patternUrl);
  for (_i = 0, _len = arrayUrl.length; _i < _len; _i++) {
    url = arrayUrl[_i];
    quote = "";
    numeral = "";
    ArrayOfQuotes = url.match(patternQuotes);
    if (ArrayOfQuotes !== null) {
      Quoutes = ArrayOfQuotes.slice(ArrayOfQuotes.length - 1);
      quote = Quoutes[0];
    }
    ArrayOfNumerals = url.match(patternSimbols);
    if (ArrayOfNumerals !== null) {
      numerals = ArrayOfNumerals.slice(ArrayOfNumerals.length - 1);
      numeral = numerals[0];
    }
    ArrayOfExtensions = url.match(patternExt);
    extensions = ArrayOfExtensions.slice(ArrayOfExtensions.length - 1);
    extension = extensions[0].substr(1).replace(patternQuotes, '');
    if (numeral === "") {
      newString = '.' + extension + this.queryString + quote;
    } else {
      newString = '.' + extension + this.queryString + numeral;
    }
    if (quote === '') {
      if (numeral === "") {
        newRegEx = new RegExp(dot.source + extension);
      } else {
        newRegEx = new RegExp(dot.source + extension + patternSimbols.source);
      }
    } else {
      switch (quote) {
        case '"':
          if (numeral === "") {
            newRegEx = new RegExp(dot.source + extension + doubleQuotes.source);
          } else {
            newRegEx = new RegExp(dot.source + extension + patternSimbols.source);
          }
          break;
        case "'":
          if (numeral === "") {
            newRegEx = new RegExp(dot.source + extension + singleQuote.source);
          } else {
            newRegEx = new RegExp(dot.source + extension + patternSimbols.source);
          }
      }
    }
    this.options.content = this.options.content.replace(newRegEx, newString);
    this.output = this.options.content;
    newRegEx.lastIndex = 0;
    patternExt.lastIndex = 0;
    patternQuotes.lastIndex = 0;
    patternSimbols.lastIndex = 0;
    dot.lastIndex = 0;
    doubleQuotes.lastIndex = 0;
    singleQuote.lastIndex = 0;
  }
};


/*
 * Expose library.
 */

module.exports = CssUrlVersioner;
