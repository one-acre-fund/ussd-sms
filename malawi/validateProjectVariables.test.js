var projectVariablesValidator = require('./validateProjectVariables');
var logger = require('../slack-logger/index');
jest.mock('../slack-logger/index');

describe('project variables validator', () => {
    beforeAll(() => {
        global.project = {vars: {}};
        global.service = {vars: {}};
        jest.resetModules();
    });
    it('should log the error once some project variables are not set', () => {
        jest.spyOn(logger, 'log');
        project.vars.roster_read_key = 'dev_roster_read_key';
        projectVariablesValidator('dev');
        expect(logger.log).toHaveBeenCalledWith('Malawi: project variable: server_name is not set');
        expect(logger.log).toHaveBeenCalledWith('Malawi: project variable: buy_back_transactions_table is not set');
        expect(logger.log).toHaveBeenCalledWith('Malawi: project variable: project_name is not set');
        expect(logger.log).toHaveBeenCalledWith('Malawi: project variable: service_name is not set');
    });

    it('should not log once the project variable is set', () => {
        jest.spyOn(logger, 'log');
        project.vars.roster_read_key = 'dev_roster_read_key';
        projectVariablesValidator('dev');
        expect(logger.log).not.toHaveBeenCalledWith('Malawi: project variable: roster_read_key is not set');
    });
});
