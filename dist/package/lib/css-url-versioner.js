
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

CssUrlVersioner.prototype.insertVersion = function() {
  var arrString, i, patternExt, patternImgExt, url, _i, _len;
  patternExt = /(url)([\(]{1})([\"|\']?)([a-zA-Z0-9\@\.\/_-]+)([\#]?[a-zA-Z0-9_-]+)?([\"|\']?)([\)]{1})/g;
  arrString = this.options.content.match(patternExt);
  patternImgExt = /\.(png|jpg|jpeg|gif)(\"|\')/g;
  for (i = _i = 0, _len = arrString.length; _i < _len; i = ++_i) {
    url = arrString[i];
    console.log(url);

    /*
    		patternString = arrString[i].toString()
    		comilla   = patternString.substr(patternString.length-1)
    		extension = patternString.substr(1, patternString.length-2)
    		newString = "." + extension + "?version"+comilla
    
    		console.log("comilla: "+comilla+"\n")
    		console.log("extension: "+extension+"\n")
    		console.log("newString: "+newString+"\n")
    
    		dot = /\./
    		comillaDoble  = /\"/
    		comillaSimple = /\'/
    
    		if (comilla is '"')
    			newRegEx = new RegExp(dot.source + extension + comillaDoble.source)
    		else
    			newRegEx = new RegExp(dot.source + extension + comillaSimple.source)
    		
    
    		newFileContent = @options.content.replace(newRegEx, newString)
    		
    		console.log newFileContent
    
    		newRegEx.lastIndex = 0
    		patternExt.lastIndex = 0
     */
  }
};


/*
 * Expose library.
 */

module.exports = CssUrlVersioner;
