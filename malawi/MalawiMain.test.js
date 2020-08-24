jest.mock('../notifications/elk-notification/elkNotification');

describe('Malawi legacy', () => {
    beforeAll(() => {
        global.state = { vars: {} };
        global.service.active = false;
        global.project = {
            vars: {
                dev_server_name: 'https://api.oaf.org',
                dev_roster_api_key: 'Sample API key',
                roster_read_key: 'roster_Read_key',
                dev_varieties_table_id: 'dev_varieties_table_id',
                lang: 'en-mw'
            }
        };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should setup the service variables', () => {
        require('./MalawiMain');
        expect(service.vars.server_name).toEqual('https://api.oaf.org');
        expect(service.vars.roster_api_key).toEqual('Sample API key');
        expect(service.vars.roster_read_key).toEqual('roster_Read_key');
        expect(service.vars.varieties_table_id).toEqual('dev_varieties_table_id');
    });

    it('should start the main service and promt user for account number', () => {
        require('./MalawiMain');
        global.main();
        expect(sayText).toHaveBeenCalledWith('Welcome to the OAF Malawi buyback portal. Please enter the account number of the client you are recording a transaction for.');
        expect(promptDigits).toHaveBeenCalledWith('account_number', {'maxDigits': 8, 'submitOnHash': false, 'timeout': 10});
    });

    it('should register the account number input handler', () => {
        require('./MalawiMain');
        const inputHandlers = require('./inputHandlers/inputHandlers');
        expect(addInputHandler).toHaveBeenCalledWith('account_number', inputHandlers.accountNumberInputHandler);
    });
});