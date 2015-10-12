###
Test: cssUrl
###

#mocha = require('mocha')
fs      = require('fs')
cssVersioner = require('../../dist/package/index')
#should = require('should')

mainInstance = null
d = new Date()
version = d.getFullYear().toString() + (d.getMonth()+1).toString() + d.getDate().toString()

data = fs.readFileSync('./test/css/test.css', 'utf8')

mainInstance = cssVersioner({
	content: data,
	variable: 'z'
})

describe('cssUrl', () ->
	options = {}
	
	beforeEach( () ->
		
		return
	)

	describe('Extend', () ->
		it('mainInstance.options.variable should be equal to "z".', () ->
			mainInstance.options.variable.should.be.equal('z')
			return
		)
		return
	)

	describe('Last commit', () ->
		instance = cssVersioner({
			content: data,
			lastcommit: true
		})
		
		it('instance.lastcommit should be equal to ' + true + '.', () ->
			instance.options.lastcommit.should.be.equal(true)
			return
		)
		return
	)	

	describe('Default Version', () ->
		it('mainInstance.version should be equal to ' + version + '.', () ->
			mainInstance.version.should.be.equal(version)
			return
		)
		return
	)

	describe('Custom Version', () ->
		instance = cssVersioner({
			content: data,
			version: 'myVersion'
		})
		it('instance.version should be equal to "myVersion".', () ->
			instance.version.should.be.equal("myVersion")
			return
		)
		return
	)

	describe('Query String', () ->
		
		queryString = '?z=' + version

		it('mainInstance.queryString should be equal to ' + queryString + '.', () ->
			mainInstance.queryString.should.be.equal(queryString)
			return
		)
		return
	)

	assertVersioned = (arr, indx) ->
		return () ->
			instance = cssVersioner({
				content: arr[indx * 2]
			})

			it(arr[indx * 2] + ' should be convert to: ' + arr[indx * 2 + 1] + '.', () ->
				instance.output.should.be.equal(arr[indx * 2 + 1])
			)

	describe('Generated versions', () ->

		queryString = '?v=' + version

		withoutQuotes = [
			'url(sprite.png)', 'url(sprite.png' + queryString + ')',
			'url(fonts/new.eot#ie)', 'url(fonts/new.eot' + queryString + '#ie)',
			'url(img/abc.dfg.png)', 'url(img/abc.dfg.png' + queryString + ')',
			'url(img/klm.nop.png#slug)', 'url(img/klm.nop.png' + queryString + '#slug)',
			'url(file with space.woff)', 'url(file with space.woff' + queryString + ')'
		]
		
		describe('Without quotes:', () ->

			for i in [0..withoutQuotes.length / 2 - 1]

				describe(withoutQuotes[i], assertVersioned(withoutQuotes, i))

			return
		)

		withSingleQuotes = [
			"url('sprite.png')", "url('sprite.png" + queryString + "')",
			"url('fonts/new.eot#ie')", "url('fonts/new.eot" + queryString + "#ie')",
			"url('img/abc.dfg.png')", "url('img/abc.dfg.png" + queryString + "')",
			"url('img/klm.nop.png#slug')", "url('img/klm.nop.png" + queryString + "#slug')",
			"url('file with space.woff')", "url('file with space.woff" + queryString + "')"
		]
		
		describe("With single quotes: '", () ->

			for i in [0..withSingleQuotes.length / 2 - 1]

				describe(withSingleQuotes[i], assertVersioned(withSingleQuotes, i))

			return
		)

		withDoubleQuotes = [
			'url("sprite.png")', 'url("sprite.png' + queryString + '")',
			'url("fonts/new.eot#ie")', 'url("fonts/new.eot' + queryString + '#ie")',
			'url("img/abc.dfg.png")', 'url("img/abc.dfg.png' + queryString + '")',
			'url("img/klm.nop.png#slug")', 'url("img/klm.nop.png' + queryString + '#slug")',
			'url("file with space.woff")', 'url("file with space.woff' + queryString + '")'
		]

		describe('With double quotes: "', () ->

			for i in [0..withDoubleQuotes.length / 2 - 1]

				describe(withDoubleQuotes[i], assertVersioned(withDoubleQuotes, i))

			return
		)

		return
	)

	return

)

