var {handlerName: splashInputHandlerName} = require('./inputHandlers/splashInputHandler');

describe('main burundi ussd', () => {
    beforeEach(() => {
        project.vars.dev_server_name = 'dev.server.com';
        project.vars.dev_roster_api_key = 'insecureApi';
        project.vars.prod_server_name = 'prod.server.com';
        project.vars.prod_roster_api_key = 'xxxXXXxxx';
        project.vars.dev_orders_table = 'orders_table_43hjhs7ks9sa';
        project.vars.dev_bundles_table = 'bundles_tableID_sdhfsadf';
    });
    afterEach(() => {
        jest.resetModules();
    });
    it('should save the environment variable', () => {
        require('./main');
        expect(service.vars.server_name).toEqual('dev.server.com');
        expect(service.vars.roster_api_key).toEqual('insecureApi');
        expect(service.vars.orders_table_id).toEqual('orders_table_43hjhs7ks9sa');
        expect(service.vars.bundles_table_id).toEqual('bundles_tableID_sdhfsadf');
    });
    it('should set the environment to production if the service is live', () => {
        service.active = true;
        delete service.vars.env;
        delete service.vars.env;
        require('./main');
        expect(service.vars.server_name).toEqual('prod.server.com');
        expect(service.vars.roster_api_key).toEqual('xxxXXXxxx');
    });
    it.each(['prod', 'dev'])('should prioritize the service variable even if the service is live for ', (env) => {
        service.vars.env = env;
        require('./main');
        expect(service.vars.server_name).toEqual(`${env}.server.com`);
    });

    it('should display the splash screen and prompt for account number', () => {
        require('./main');
        contact.vars.lang = 'en_bu';
        global.main();
        expect(sayText).toHaveBeenCalledWith('Murakaza muri OAF, Musabwe kwinjiza inomero yanyu ya Konte\n' +
        '98. English\n' +
        '99. Francais');
        expect(promptDigits).toHaveBeenCalledWith(splashInputHandlerName);
    });
});
