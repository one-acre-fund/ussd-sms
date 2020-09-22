var registration = require('./registration');
var accountNumberInputHandler = require('./inputHandlers/accountNumberInputHandler');
var confirmFirstSecondNameInputHandler = require('./inputHandlers/confirmFirstSecondNameInputHandler');
var confirmInvoiceInputHandler = require('./inputHandlers/confirmInvoiceIdInputHandler');
var confirmNidInputHandler = require('./inputHandlers/confirmNidInputHandler');
var confirmPhoneInputHandler = require('./inputHandlers/confirmPhoneNumberInputHandler');
var firstNameInputHandler = require('./inputHandlers/firstNameInputHandler');
var secondNameInputHandler = require('./inputHandlers/secondNameInputHandler');
var phoneNumberInputHandler = require('./inputHandlers/phoneNumberInputHandler');
var invoiceInputHandler = require('./inputHandlers/invoiceIdInputHandler');
var nationalIdInputHandler = require('./inputHandlers/nationalIdInputHandler');

describe.each(['en-ke', 'sw'])('duka client Registration using (%s)', (lang) => {
    it('should register all the registration input handlers --' + lang, () => {
        var accountNumberHandler = jest.fn();
        var confirmFirstSecondNameHandler = jest.fn();
        var confirmInvoiceHandler = jest.fn();
        var confirmNidHandler = jest.fn();
        var confirmPhoneHandler = jest.fn();
        var firstNameHandler = jest.fn();
        var secondNameHandler = jest.fn();
        var phoneNumberHandler = jest.fn();
        var invoiceHandler = jest.fn();
        var nationalIdHandler = jest.fn();
        
        jest.spyOn(accountNumberInputHandler, 'getHandler').mockReturnValueOnce(accountNumberHandler);
        jest.spyOn(confirmFirstSecondNameInputHandler, 'getHandler').mockReturnValueOnce(confirmFirstSecondNameHandler);
        jest.spyOn(confirmInvoiceInputHandler, 'getHandler').mockReturnValueOnce(confirmInvoiceHandler);
        jest.spyOn(confirmNidInputHandler, 'getHandler').mockReturnValueOnce(confirmNidHandler);
        jest.spyOn(confirmPhoneInputHandler, 'getHandler').mockReturnValueOnce(confirmPhoneHandler);
        jest.spyOn(firstNameInputHandler, 'getHandler').mockReturnValueOnce(firstNameHandler);
        jest.spyOn(secondNameInputHandler, 'getHandler').mockReturnValueOnce(secondNameHandler);
        jest.spyOn(phoneNumberInputHandler, 'getHandler').mockReturnValueOnce(phoneNumberHandler);
        jest.spyOn(invoiceInputHandler, 'getHandler').mockReturnValueOnce(invoiceHandler);
        jest.spyOn(nationalIdInputHandler, 'getHandler').mockReturnValueOnce(nationalIdHandler);


        registration.registerInputHandlers(lang, 'credit_officers_table', {});

        expect(addInputHandler).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, accountNumberHandler);
        expect(addInputHandler).toHaveBeenCalledWith(confirmFirstSecondNameInputHandler.handlerName, confirmFirstSecondNameHandler);
        expect(addInputHandler).toHaveBeenCalledWith(confirmInvoiceInputHandler.handlerName, confirmInvoiceHandler);
        expect(addInputHandler).toHaveBeenCalledWith(confirmNidInputHandler.handlerName, confirmNidHandler);
        expect(addInputHandler).toHaveBeenCalledWith(confirmPhoneInputHandler.handlerName, confirmPhoneHandler);
        expect(addInputHandler).toHaveBeenCalledWith(firstNameInputHandler.handlerName, firstNameHandler);
        expect(addInputHandler).toHaveBeenCalledWith(secondNameInputHandler.handlerName, secondNameHandler);
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, phoneNumberHandler);
        expect(addInputHandler).toHaveBeenCalledWith(invoiceInputHandler.handlerName, invoiceHandler);
        expect(addInputHandler).toHaveBeenCalledWith(nationalIdInputHandler.handlerName, nationalIdHandler);

        expect(accountNumberInputHandler.getHandler).toHaveBeenCalledWith(lang, 'credit_officers_table');
        expect(confirmFirstSecondNameInputHandler.getHandler).toHaveBeenCalledWith(lang, {}, 'credit_officers_table');
        expect(confirmInvoiceInputHandler.getHandler).toHaveBeenCalledWith(lang, 'credit_officers_table');
        expect(confirmNidInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(confirmPhoneInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(firstNameInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(secondNameInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(phoneNumberInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(invoiceInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(nationalIdInputHandler.getHandler).toHaveBeenCalledWith(lang);
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
