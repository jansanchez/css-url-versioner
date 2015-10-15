
/*
Test: cssUrl
 */
var cssVersioner, d, data, fs, mainInstance, version;

fs = require('fs');

cssVersioner = require('../../dist/package/index');

mainInstance = null;

d = new Date();

version = d.getFullYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString();

data = fs.readFileSync('./test/css/test.css', 'utf8');

mainInstance = cssVersioner({
  content: data,
  variable: 'z'
});

describe('cssUrl', function() {
  var assertVersioned, options;
  options = {};
  beforeEach(function() {});
  describe('Extend', function() {
    it('mainInstance.options.variable should be equal to "z".', function() {
      mainInstance.options.variable.should.be.equal('z');
    });
  });
  describe('Last commit', function() {
    var instance;
    instance = cssVersioner({
      content: data,
      lastcommit: true
    });
    it('instance.lastcommit should be equal to ' + true + '.', function() {
      instance.options.lastcommit.should.be.equal(true);
    });
  });
  describe('Default Version', function() {
    it('mainInstance.version should be equal to ' + version + '.', function() {
      mainInstance.version.should.be.equal(version);
    });
  });
  describe('Custom Version', function() {
    var instance;
    instance = cssVersioner({
      content: data,
      version: 'myVersion'
    });
    it('instance.version should be equal to "myVersion".', function() {
      instance.version.should.be.equal("myVersion");
    });
  });
  describe('Query String', function() {
    var queryString;
    queryString = '?z=' + version;
    it('mainInstance.queryString should be equal to ' + queryString + '.', function() {
      mainInstance.queryString.should.be.equal(queryString);
    });
  });
  assertVersioned = function(arr, indx) {
    return function() {
      var instance;
      instance = cssVersioner({
        content: arr[indx]
      });
      return it(arr[indx] + ' should be convert to: ' + arr[indx + 1] + '.', function() {
        return instance.output.should.be.equal(arr[indx + 1]);
      });
    };
  };
  describe('Generated versions', function() {
    var queryString, withDoubleQuotes, withSingleQuotes, withoutQuotes;
    queryString = '?v=' + version;
    withoutQuotes = ['url(sprite.png)', 'url(sprite.png' + queryString + ')', 'url(fonts/new.eot#ie)', 'url(fonts/new.eot' + queryString + '#ie)', 'url(img/abc.dfg.png)', 'url(img/abc.dfg.png' + queryString + ')', 'url(img/klm.nop.png#slug)', 'url(img/klm.nop.png' + queryString + '#slug)', 'url(file with space.woff)', 'url(file with space.woff' + queryString + ')'];
    describe('Without quotes:', function() {
      var i, j, ref;
      for (i = j = 0, ref = withoutQuotes.length / 2 - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        describe(withoutQuotes[i * 2], assertVersioned(withoutQuotes, i * 2));
      }
    });
    withSingleQuotes = ["url('sprite.png')", "url('sprite.png" + queryString + "')", "url('fonts/new.eot#ie')", "url('fonts/new.eot" + queryString + "#ie')", "url('img/abc.dfg.png')", "url('img/abc.dfg.png" + queryString + "')", "url('img/klm.nop.png#slug')", "url('img/klm.nop.png" + queryString + "#slug')", "url('file with space.woff')", "url('file with space.woff" + queryString + "')"];
    describe("With single quotes: '", function() {
      var i, j, ref;
      for (i = j = 0, ref = withSingleQuotes.length / 2 - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        describe(withSingleQuotes[i * 2], assertVersioned(withSingleQuotes, i * 2));
      }
    });
    withDoubleQuotes = ['url("sprite.png")', 'url("sprite.png' + queryString + '")', 'url("fonts/new.eot#ie")', 'url("fonts/new.eot' + queryString + '#ie")', 'url("img/abc.dfg.png")', 'url("img/abc.dfg.png' + queryString + '")', 'url("img/klm.nop.png#slug")', 'url("img/klm.nop.png' + queryString + '#slug")', 'url("file with space.woff")', 'url("file with space.woff' + queryString + '")'];
    describe('With double quotes: "', function() {
      var i, j, ref;
      for (i = j = 0, ref = withDoubleQuotes.length / 2 - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        describe(withDoubleQuotes[i * 2], assertVersioned(withDoubleQuotes, i * 2));
      }
    });
  });
});
