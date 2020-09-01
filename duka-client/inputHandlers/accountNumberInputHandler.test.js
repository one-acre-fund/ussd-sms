const accountNumberInputHandler = require('./accountNumberInputHandler');
var getClient = require('../../shared/rosterApi/getClient');
var serviceHandler = require('./serviceInputHandler');

jest.mock('../../shared/rosterApi/getClient');

describe('duka client', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en-ke'} };
        global.service.active = false;
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should the language to sw if was otherwise and reprompt for account number', () => {
        accountNumberInputHandler.handler('99');
        expect(state.vars.lang).toEqual('sw');
        expect(sayText).toHaveBeenCalledWith('Karibu OAF. Tafadhali bonyeza nambari zako 8 za OAF\n');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'maxDigits': 8, 'submitOnHash': false});
    });

    it('should change the language to en-ke if was sw', () => {
        state.vars.lang = 'sw';
        accountNumberInputHandler.handler('99');
        expect(state.vars.lang).toEqual('en-ke');
        expect(sayText).toHaveBeenCalledWith('Welcome to One Acre Fund. Please enter your 8-digit OAF ID\n');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'maxDigits': 8, 'submitOnHash': false});
    });

    it('should reprompt the user for account number once the input is invalid', () => {
        getClient.mockImplementationOnce(() => null);
        state.vars.lang = 'en-ke';
        accountNumberInputHandler.handler('00');
        expect(sayText).toHaveBeenCalledWith('invalid input\nWelcome to One Acre Fund. Please enter your 8-digit OAF ID\n');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'maxDigits': 8, 'submitOnHash': false});
    });

    it('should prompt user to select a service once the account number is validated', () => {
        getClient.mockImplementationOnce(() => ({client: 'ok'}));
        state.vars.lang = 'en-ke';
        accountNumberInputHandler.handler('00');
        expect(sayText).toHaveBeenCalledWith('Select service\n1) Register Client');
        expect(promptDigits).toHaveBeenCalledWith(serviceHandler.handlerName, {'maxDigits': 2, 'submitOnHash': false});
    });
});