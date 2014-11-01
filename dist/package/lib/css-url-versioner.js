
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
  this.sha1 = null;
  this.version = null;
  this.queryString = null;
  this.output = '';
  this.extend(settings);
  this.generateVersion();
  this.getQueryString();
  this.insertVersion();
  return this;
};

CssUrlVersioner.prototype.extend = function(settings) {
  this["default"] = {
    variable: 'v',
    version: '',
    lastcommit: false
  };
  this.options = extend(this["default"], settings);
};

CssUrlVersioner.prototype.generateVersion = function() {
  if (this.options.version === '') {
    this.setDefaultVersion();
  } else {
    this.version = this.options.version;
    this.sha1 = this.version;
  }
  if (this.options.lastcommit) {
    this.getLastCommit();
  }
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

CssUrlVersioner.prototype.getQuote = function(url, pattern) {
  var ArrayOfQuotes, Quoutes, quote;
  ArrayOfQuotes = url.match(pattern);
  quote = "";
  if (ArrayOfQuotes !== null) {
    Quoutes = ArrayOfQuotes.slice(ArrayOfQuotes.length - 1);
    quote = Quoutes[0];
  }
  return quote;
};

CssUrlVersioner.prototype.getNumeral = function(url, pattern) {
  var ArrayOfNumerals, numeral, numerals;
  ArrayOfNumerals = url.match(pattern);
  numeral = "";
  if (ArrayOfNumerals !== null) {
    numerals = ArrayOfNumerals.slice(ArrayOfNumerals.length - 1);
    numeral = numerals[0];
  }
  return numeral;
};

CssUrlVersioner.prototype.getExtension = function(url, pattern, patternQuotes) {
  var ArrayOfExtensions, extension, extensions;
  ArrayOfExtensions = url.match(pattern);
  extensions = ArrayOfExtensions.slice(ArrayOfExtensions.length - 1);
  extension = extensions[0].substr(1).replace(patternQuotes, '');
  return extension;
};

CssUrlVersioner.prototype.getNewString = function(numeral, quote, extension) {
  var additionalSign, newString;
  if (numeral === "") {
    additionalSign = quote;
  } else {
    additionalSign = numeral;
  }
  newString = '.' + extension + this.queryString + additionalSign;
  return newString;
};

CssUrlVersioner.prototype.getTheLastPart = function(quote, numeral, singleQuote, doubleQuotes, patternSimbols) {
  var theLastPartOfTheRegExp;
  theLastPartOfTheRegExp = "";
  if (quote === '') {
    if (numeral !== "") {
      theLastPartOfTheRegExp = patternSimbols.source;
    }
  } else {
    switch (quote) {
      case '"':
        if (numeral === "") {
          theLastPartOfTheRegExp = doubleQuotes.source;
        } else {
          theLastPartOfTheRegExp = patternSimbols.source;
        }
        break;
      case "'":
        if (numeral === "") {
          theLastPartOfTheRegExp = singleQuote.source;
        } else {
          theLastPartOfTheRegExp = patternSimbols.source;
        }
    }
  }
  return theLastPartOfTheRegExp;
};

CssUrlVersioner.prototype.insertVersion = function() {
  var arrayUrl, dot, doubleQuotes, extension, newRegEx, newString, numeral, patternExt, patternQuotes, patternSimbols, patternUrl, quote, singleQuote, theLastPartOfTheRegExp, url, _i, _len;
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
    quote = this.getQuote(url, patternQuotes);
    numeral = this.getNumeral(url, patternSimbols);
    extension = this.getExtension(url, patternExt, patternQuotes);
    newString = this.getNewString(numeral, quote, extension);
    theLastPartOfTheRegExp = this.getTheLastPart(quote, numeral, singleQuote, doubleQuotes, patternSimbols);
    newRegEx = new RegExp(dot.source + extension + theLastPartOfTheRegExp);
    this.options.content = this.options.content.replace(newRegEx, newString);
    newRegEx.lastIndex = 0;
    patternExt.lastIndex = 0;
    patternQuotes.lastIndex = 0;
    patternSimbols.lastIndex = 0;
    dot.lastIndex = 0;
    doubleQuotes.lastIndex = 0;
    singleQuote.lastIndex = 0;
  }
  this.output = this.options.content;
};


/*
 * Expose library.
 */

module.exports = CssUrlVersioner;
