var accountNumberInputHandler = require('./inputHandlers/accountNumberInputHandler');

jest.mock('../notifications/elk-notification/elkNotification');

describe('Malawi legacy', () => {
    beforeAll(() => {
        global.state = { vars: {} };
        global.service.active = false;
        global.project = {
            vars: {
                dev_server_name: 'https://api.oaf.org',
                roster_read_key: 'roster_Read_key',
                dev_varieties_table: 'dev_varieties_table',
                dev_buyback_transactions_table: 'dev_buyback_transactions_table',
                lang: 'en-mw'
            }
        };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should setup the service variables', () => {
        require('./MalawiMain');
        expect(service.vars.server_name).toEqual(project.vars.dev_server_name);
        expect(service.vars.roster_read_key).toEqual(project.vars.roster_read_key);
        expect(service.vars.varieties_table).toEqual(project.vars.dev_varieties_table);
        expect(service.vars.buyback_transactions_table).toEqual(project.vars.dev_buyback_transactions_table);
    });

    it('should start the main service and promt user for account number', () => {
        require('./MalawiMain');
        global.main();
        expect(sayText).toHaveBeenCalledWith('Welcome to the OAF Client portal. Please enter your 8 digit account number which you use for repayment of your loan through mobile money.');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName);
    });
});