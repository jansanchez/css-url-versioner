
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
    newString = '.' + extension + this.queryString + additionalSign + ')';
  } else {
    additionalSign = numeral;
    newString = '.' + extension + this.queryString + additionalSign;
  }
  return newString;
};

CssUrlVersioner.prototype.getQuotesSource = function(quote, singleQuote, doubleQuotes) {
  var quotes;
  quotes = "";
  if (quote === "'") {
    quotes = singleQuote.source;
  }
  if (quote === '"') {
    quotes = doubleQuotes.source;
  }
  return quotes;
};

CssUrlVersioner.prototype.numeralCondition = function(numeral, quotes, patternSimbols) {
  var theLastPartOfTheRegExp;
  theLastPartOfTheRegExp = patternSimbols.source;
  if (numeral === "") {
    theLastPartOfTheRegExp = quotes;
  }
  return theLastPartOfTheRegExp;
};

CssUrlVersioner.prototype.getTheLastPart = function(quote, numeral, singleQuote, doubleQuotes, patternSimbols) {
  var quotes, theLastPartOfTheRegExp;
  theLastPartOfTheRegExp = "";
  if ((quote === '') && (numeral !== "")) {
    theLastPartOfTheRegExp = patternSimbols.source;
    return theLastPartOfTheRegExp;
  }
  quotes = this.getQuotesSource(quote, singleQuote, doubleQuotes);
  theLastPartOfTheRegExp = this.numeralCondition(numeral, quotes, patternSimbols);
  return theLastPartOfTheRegExp;
};

CssUrlVersioner.prototype.insertVersion = function() {
  var arrayUrl, dot, doubleQuotes, extension, i, len, newRegEx, newString, numeral, patternExt, patternQuotes, patternRightBracket, patternSimbols, patternUrl, quote, singleQuote, theLastPartOfTheRegExp, url;
  patternUrl = /url([\(]{1})([\"|\']?)([a-zA-Z0-9\@\.\/_-]+)([\#]?[a-zA-Z0-9_-]+)?([\"|\']?)([\)]{1})/g;
  patternQuotes = /(\"|\')/g;
  patternExt = /(\.{1}[a-zA-Z0-9]{2,4})(\"|\')?/g;
  patternSimbols = /([\#]{1})/g;
  doubleQuotes = /\"/;
  singleQuote = /\'/;
  dot = /\./;
  patternRightBracket = /[\)]{1}/;
  arrayUrl = this.options.content.match(patternUrl) || [];
  for (i = 0, len = arrayUrl.length; i < len; i++) {
    url = arrayUrl[i];
    quote = this.getQuote(url, patternQuotes);
    numeral = this.getNumeral(url, patternSimbols);
    extension = this.getExtension(url, patternExt, patternQuotes);
    theLastPartOfTheRegExp = this.getTheLastPart(quote, numeral, singleQuote, doubleQuotes, patternSimbols);
    newString = this.getNewString(numeral, quote, extension);
    if (numeral === "") {
      newRegEx = new RegExp(dot.source + extension + theLastPartOfTheRegExp + patternRightBracket.source);
    } else {
      newRegEx = new RegExp(dot.source + extension + theLastPartOfTheRegExp);
    }
    this.options.content = this.options.content.replace(newRegEx, newString);
    newRegEx.lastIndex = 0;
    patternExt.lastIndex = 0;
    patternQuotes.lastIndex = 0;
    patternSimbols.lastIndex = 0;
    doubleQuotes.lastIndex = 0;
    singleQuote.lastIndex = 0;
    theLastPartOfTheRegExp.lastIndex = 0;
    dot.lastIndex = 0;
    patternRightBracket.lastIndex = 0;
  }
  patternUrl.lastIndex = 0;
  this.output = this.options.content;
};


/*
 * Expose library.
 */

module.exports = CssUrlVersioner;
