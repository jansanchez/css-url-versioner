
/*
Test: cssUrl
 */
var cssVersioner, d, data, fs, instance, version;

fs = require('fs');

cssVersioner = require('../../dist/package/index');

instance = null;

d = new Date();

version = d.getFullYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString();

data = fs.readFileSync('./test/css/test.css', 'utf8');

instance = cssVersioner({
  content: data,
  variable: 'z'
});

describe('cssUrl', function() {
  var options;
  options = {};
  beforeEach(function() {});
  describe('Extend', function() {
    it('instance.options.variable should be equal to "z".', function() {
      instance.options.variable.should.be.equal('z');
    });
  });
  describe('Default Version', function() {
    it('instance.version should be equal to ' + version + '.', function() {
      instance.version.should.be.equal(version);
    });
  });
  describe('Custom Version', function() {
    var otherInstance;
    otherInstance = cssVersioner({
      content: data,
      version: 'myVersion'
    });
    it('otherInstance.version should be equal to "myVersion".', function() {
      otherInstance.version.should.be.equal("myVersion");
    });
  });
  describe('Query String', function() {
    var queryString;
    queryString = '?z=' + version;
    it('instance.queryString should be equal to ' + queryString + '.', function() {
      instance.queryString.should.be.equal(queryString);
    });
  });
});
