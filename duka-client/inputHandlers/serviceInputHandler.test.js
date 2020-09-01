// const servicesInputHandler = require('./accountNumberInputHandler');
const serviceHandler = require('./serviceInputHandler');
const dukaClientRegistration = require('../duka-client-registration/dukaClientRegistration');

jest.mock('../../shared/rosterApi/getClient');
jest.mock('../duka-client-registration/dukaClientRegistration');

describe('duka client', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en-ke'} };
        global.service.active = false;
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt for choosing a service once the input is invalid', () => {
        state.vars.main_menu = 'select service\n1) Register Client';
        serviceHandler.handler('00');
        expect(sayText).toHaveBeenCalledWith('invalid input\nselect service\n1) Register Client');
        expect(promptDigits).toHaveBeenCalledWith(serviceHandler.handlerName, {'maxDigits': 2, 'submitOnHash': false});
    });

    it('should start the duka client registration', () => {
        serviceHandler.handler('1');
        expect(dukaClientRegistration)
    });
});