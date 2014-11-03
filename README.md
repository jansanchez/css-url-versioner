

# CSS Url Versioner [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Code Climate Status][codeclimate-image]][codeclimate-url] [![Codeship Status][codeship-image]][codeship-url]

> A node package for css url versioner

## Getting Started

### Install:

```
npm install --save-dev css-url-versioner
```

### How to use:

```
var cssVersioner = require('css-url-versioner');

fs.readFile('test/css/test.css', 'utf8', function (err, data) {
    var newCss = cssVersioner({
        content: data
    });
    console.log(newCss.output);
});

```

### or

```
var data = '.some_selector{background-image: url("img/sprite.png");}';

var cssVersioned = cssVersioner({
    content: data
});

console.log(cssVersioned.output);

//logs: '.some_selector{background-image: url("img/sprite.png?2014111");}';

```


### Options:

#### content
Required: `true`

Here go the css content we want versioning

```
{content: '.some_selector{background-image: url("img/sprite.png");}'}
```

#### variable:
Default: `v`

Here go the variable of our version, for '?myVariable=yyyymmdd'

```
{variable: 'myVariable'}
```

#### version:
Default: `yyyymmdd`

Here you go a custom version if you so desire, but if we do not put this key, then the default version will be the current date.

```
{version: '0.0.2'}
```

#### lastcommit: 
Default: `false`

If we want that version to be our short version of last commit in git, configured 'lastcommit' to true.

```
{lastcommit: true}
```


[downloads-image]: http://img.shields.io/npm/dm/css-url-versioner.svg
[npm-url]: https://www.npmjs.org/package/css-url-versioner
[npm-image]: http://img.shields.io/npm/v/css-url-versioner.svg

[travis-url]: https://travis-ci.org/jansanchez/css-url-versioner
[travis-image]: http://img.shields.io/travis/jansanchez/css-url-versioner.svg

[coveralls-url]: https://coveralls.io/r/jansanchez/css-url-versioner
[coveralls-image]: https://img.shields.io/coveralls/jansanchez/css-url-versioner.svg

[codeship-url]: https://www.codeship.io/projects/44868
[codeship-image]: https://codeship.io/projects/221e0440-44c9-0132-43bc-1e738e05cfd5/status?branch=master

[codeclimate-url]: https://codeclimate.com/github/jansanchez/css-url-versioner
[codeclimate-image]: https://codeclimate.com/github/jansanchez/css-url-versioner/badges/gpa.svg

