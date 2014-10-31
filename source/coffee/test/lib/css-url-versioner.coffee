###
Test: cssUrl
###

fs      = require('fs')
cssVersioner = require('../../dist/package/index')

instance = null
d = new Date()
version = d.getFullYear().toString() + (d.getMonth()+1).toString() + d.getDate().toString()

data = fs.readFileSync('./test/css/test.css', 'utf8')

instance = cssVersioner({
	content: data,
	variable: 'z'
})

describe('cssUrl', () ->
	options = {}
	
	beforeEach( () ->
		return
	)

	describe('Extend', () ->
		it('instance.options.variable should be equal to "z".', () ->
			instance.options.variable.should.be.equal('z')
			return
		)
		return
	)

	describe('Default Version', () ->
		it('instance.version should be equal to ' + version + '.', () ->
			instance.version.should.be.equal(version)
			return
		)
		return
	)

	describe('Custom Version', () ->
		otherInstance = cssVersioner({
			content: data,
			version: 'myVersion'
		})
		it('otherInstance.version should be equal to "myVersion".', () ->
			otherInstance.version.should.be.equal("myVersion")
			return
		)
		return
	)

	describe('Query String', () ->
		queryString = '?z=' + version
		it('instance.queryString should be equal to ' + queryString + '.', () ->
			instance.queryString.should.be.equal(queryString)
			return
		)
		return
	)
	
	

	return

)

