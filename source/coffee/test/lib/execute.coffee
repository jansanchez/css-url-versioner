###
Test: execute
###

Execute = require('../../dist/package/lib/execute')

mainInstance = null

exec = new Execute()
command = 'pwd'

describe('Execute', () ->
	options = {}
	
	beforeEach( () ->
		
		return
	)

	response = exec.runCommand()

	describe('runCommand()', () ->

		it('Debe devolver alguna cadena de texto al ejecutar el comando "pwd".', () ->
			response.should.not.be.empty
		)

	)




	return

)

