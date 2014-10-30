
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
  console.log(this.options.content);
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

CssUrlVersioner.prototype.insertVersion = function() {
  var almohadilla, arrString, c1, c2, c3, c4, comilla, comillaDoble, comillaSimple, dot, extension, newArr, newArr2, newFileContent, newRegEx, newString, patternComillas, patternExt, patternSimbols, patternString, patternUrl, url, _i, _len;
  patternUrl = /url([\(]{1})([\"|\']?)([a-zA-Z0-9\@\.\/_-]+)([\#]?[a-zA-Z0-9_-]+)?([\"|\']?)([\)]{1})/g;
  arrString = this.options.content.match(patternUrl);
  patternComillas = /(\"|\')/g;
  patternExt = /(\.{1}[a-zA-Z0-9]{2,4})(\"|\')?/g;
  patternSimbols = /([\#]{1})/g;
  comillaDoble = /\"/;
  comillaSimple = /\'/;
  dot = /\./;
  for (_i = 0, _len = arrString.length; _i < _len; _i++) {
    url = arrString[_i];
    comilla = "";
    almohadilla = "";
    patternString = url.toString();
    c1 = url.match(patternComillas);
    if (c1 !== null) {
      c2 = c1.slice(c1.length - 1);
      comilla = c2[0];
    }
    c3 = url.match(patternSimbols);
    if (c3 !== null) {
      c4 = c3.slice(c3.length - 1);
      almohadilla = c4[0];
    }
    newArr = url.match(patternExt);
    newArr2 = newArr.slice(newArr.length - 1);
    extension = newArr2[0].substr(1).replace(patternComillas, '');
    if (almohadilla === "") {
      newString = '.' + extension + this.queryString + comilla;
    } else {
      newString = '.' + extension + this.queryString + almohadilla;
    }
    if (comilla === '') {
      if (almohadilla === "") {
        newRegEx = new RegExp(dot.source + extension);
      } else {
        newRegEx = new RegExp(dot.source + extension + patternSimbols.source);
      }
    } else {
      switch (comilla) {
        case '"':
          if (almohadilla === "") {
            newRegEx = new RegExp(dot.source + extension + comillaDoble.source);
          } else {
            newRegEx = new RegExp(dot.source + extension + patternSimbols.source);
          }
          break;
        case "'":
          if (almohadilla === "") {
            newRegEx = new RegExp(dot.source + extension + comillaSimple.source);
          } else {
            newRegEx = new RegExp(dot.source + extension + patternSimbols.source);
          }
      }
    }
    newFileContent = this.options.content.replace(newRegEx, newString);
    this.options.content = newFileContent;
    newRegEx.lastIndex = 0;
    patternExt.lastIndex = 0;
    patternComillas.lastIndex = 0;
    patternSimbols.lastIndex = 0;
    dot.lastIndex = 0;
    comillaDoble.lastIndex = 0;
    comillaSimple.lastIndex = 0;
  }
};


/*
 * Expose library.
 */

module.exports = CssUrlVersioner;
