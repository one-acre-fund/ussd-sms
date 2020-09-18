var registration = require('./registration');
var accountNumberInputHandler = require('./inputHandlers/accountNumberInputHandler');

describe.each(['en-ke', 'sw'])('duka client Registration using (%s)', (lang) => {
    it('should register all the registration input handlers --' + lang, () => {
        var accountNumberHandler = jest.fn();
        jest.spyOn(accountNumberInputHandler, 'getHandler').mockReturnValueOnce(accountNumberHandler);
        registration.registerInputHandlers(lang, 'credit_officers_table');
        expect(addInputHandler).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, accountNumberHandler);
        expect(accountNumberInputHandler.getHandler).toHaveBeenCalledWith(lang, 'credit_officers_table');
    });

    it('should prompt the user for the account number on start --' + lang, () => {
        registration.start(lang);
        var message = {
            'en-ke': 'Please reply with the account number of the farmer\n"0" for new client.',
            'sw': 'Tafadhali jibu na nambari ya akaunti ya mkulima\n"0" kwa mteja mpya.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName);
    });
});
