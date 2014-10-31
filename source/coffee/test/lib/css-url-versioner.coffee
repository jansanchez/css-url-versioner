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
	lastcommit: true
})

describe('cssUrl', () ->
	options = {}
	
	beforeEach( () ->
		return
	)

	describe('Extend', () ->
		it('instance.options.lastcommit should be equal to true.', () ->
			instance.options.lastcommit.should.be.equal(true)
			return
		)
		return
	)

	describe('Default Version', () ->
		it('instance.version should be equal to true.', () ->

			instance = cssVersioner({
				content: data
			})
			
			instance.version.should.be.equal(version)
			return
		)
		return
	)
	

	return

)
