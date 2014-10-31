
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
  lastcommit: true
});

describe('cssUrl', function() {
  var options;
  options = {};
  beforeEach(function() {});
  describe('Extend', function() {
    it('instance.options.lastcommit should be equal to true.', function() {
      instance.options.lastcommit.should.be.equal(true);
    });
  });
  describe('Default Version', function() {
    it('instance.version should be equal to true.', function() {
      instance = cssVersioner({
        content: data
      });
      instance.version.should.be.equal(version);
    });
  });
});
