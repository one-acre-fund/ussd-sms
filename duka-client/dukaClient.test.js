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
                lang: 'en-ke'
            }
        };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should setup the service variables', () => {
        require('./dukaClient');
        global.main();
        expect(service.vars.server_name).toEqual('https://api.oaf.org');
        expect(service.vars.roster_api_key).toEqual('Sample API key');
        expect(service.vars.roster_read_key).toEqual('roster_Read_key');
    });

    it('should start the main service and prompt user for account number', () => {
        require('./dukaClient');
        global.main();
        expect(sayText).toHaveBeenCalledWith('Welcome to One Acre Fund. Please enter your 8-digit OAF ID\n99) Kiswahili');
        expect(promptDigits).toHaveBeenCalledWith('account_number', {'maxDigits': 8, 'submitOnHash': false});
    });
});