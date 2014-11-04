
/*
Test: execute
 */
var Execute, command, exec, mainInstance;

Execute = require('../../dist/package/lib/execute');

mainInstance = null;

exec = new Execute();

command = 'pwd';

describe('Execute', function() {
  var options, response;
  options = {};
  beforeEach(function() {});
  response = exec.runCommand(command);
  describe('runCommand()', function() {
    return it('Debe devolver alguna cadena de texto al ejecutar el comando "pwd".', function() {
      return response.should.not.be.empty;
    });
  });
});
