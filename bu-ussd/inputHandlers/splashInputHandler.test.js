const {handlerName: splashHandlerName, getHAndler: getSplashHandler} = require('./splashInputHandler');

describe('splash input handler', () => {
    it('should change language if input is 99 or 98', () => {
        const onAccountNumberValidated = jest.fn();
        var splashHandler = getSplashHandler('bu', onAccountNumberValidated);
        splashHandler('98');
        expect(contact.vars.lang).toEqual('en-bu');
        expect(sayText).toHaveBeenCalledWith('Welcome to OAF. Please enter your account number\n' +
        '98. Kirundi\n' +
        '99. Francais');
        expect(promptDigits).toHaveBeenCalledWith(splashHandlerName);
    });
});