const {handlerName: splashHandlerName, getHAndler: getSplashHandler} = require('./splashInputHandler');
const rosterAPI = require('../../rw-legacy/lib/roster/api');

jest.mock('../../rw-legacy/lib/roster/api');

describe('splash input handler', () => {
    it('should change language if input is 99 or 98', () => {
        const onAccountNumberValidated = jest.fn();
        var splashHandler = getSplashHandler('bu', onAccountNumberValidated);
        splashHandler('98');
        expect(contact.vars.lang).toEqual('en_bu');
        expect(sayText).toHaveBeenCalledWith('Welcome to OAF. Please enter your account number\n' +
        '98. Kirundi\n' +
        '99. Francais');
        expect(promptDigits).toHaveBeenCalledWith(splashHandlerName);
    });

    it('should validate the account number and call onAccountNumberValidated if the account is valid', () => {
        const onAccountNumberValidated = jest.fn();
        var clientMock = {AccountNumber: '12345678'};
        jest.spyOn(rosterAPI, 'authClient').mockReturnValueOnce(true);
        jest.spyOn(rosterAPI, 'getClient').mockReturnValueOnce(clientMock);
        var splashHandler = getSplashHandler('en_bu', onAccountNumberValidated);
        splashHandler('12345678');
        expect(onAccountNumberValidated).toHaveBeenCalledWith('en_bu', clientMock);
        expect(sayText).not.toHaveBeenCalled();
        expect(promptDigits).not.toHaveBeenCalled();
    });

    it('should reprompt for account number if getClient does not return truthy', () => {
        const onAccountNumberValidated = jest.fn();
        jest.spyOn(rosterAPI, 'authClient').mockReturnValueOnce(true);
        jest.spyOn(rosterAPI, 'getClient').mockReturnValueOnce(null);
        var splashHandler = getSplashHandler('en_bu', onAccountNumberValidated);
        splashHandler('12345678');
        expect(sayText).toHaveBeenCalledWith('Welcome to OAF. Please enter your account number\n' +
        '98. Kirundi\n' +
        '99. Francais');
        expect(promptDigits).toHaveBeenCalledWith(splashHandlerName);
    });
    it('should reprompt for account number if authClient does not return truthy', () => {
        const onAccountNumberValidated = jest.fn();
        jest.spyOn(rosterAPI, 'authClient').mockReturnValueOnce(null);
        jest.spyOn(rosterAPI, 'getClient').mockReturnValueOnce(null);
        var splashHandler = getSplashHandler('en_bu', onAccountNumberValidated);
        splashHandler('12345678');
        expect(sayText).toHaveBeenCalledWith('Welcome to OAF. Please enter your account number\n' +
        '98. Kirundi\n' +
        '99. Francais');
        expect(promptDigits).toHaveBeenCalledWith(splashHandlerName);
    });
});