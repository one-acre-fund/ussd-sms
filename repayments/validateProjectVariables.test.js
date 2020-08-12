var projectVariablesValidator = require('./validateProjectVariables');
var logger = require('../slack-logger/index');
jest.mock('../slack-logger/index');

describe('project variables validator', () => {
    beforeAll(() => {
        global.project = {vars: {}};
        global.service = {vars: {}};
    });

    beforeEach(() => {
        jest.resetModules();
    });

    it('should log the error once some project variables are not set', () => {
        jest.spyOn(logger, 'log');
        project.vars.roster_read_key = 'dev_roster_read_key';
        projectVariablesValidator('dev');
        expect(logger.log).toHaveBeenCalledWith('Repayments: project variable: server_name is not set');
        expect(logger.log).not.toHaveBeenCalledWith('Repayments: project variable: roster_read_key is not set');
    });

    it('should not log once the project variable is set', () => {
        jest.spyOn(logger, 'log');
        project.vars.roster_read_key = 'dev_roster_read_key';
        projectVariablesValidator('dev');
        expect(logger.log).not.toHaveBeenCalledWith('Repayments: project variable: roster_read_key is not set');
    });
});
