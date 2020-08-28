var phoneNumberInputHandler = require('./phoneNumberHandler');

describe('Phone number input handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en-mw'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt for phone number if input does not start with 088 or 099', () => {
        phoneNumberInputHandler.handler('0773245234');
        expect(sayText).toHaveBeenCalledWith('Invalid mobile money account number. Please enter a 10 digits phone number starting with 088 or 099');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 10
        });
    });

    it('should reprompt for phone number if input is not a 10 digits phone', () => {
        phoneNumberInputHandler.handler('09932452345');
        expect(sayText).toHaveBeenCalledWith('Invalid mobile money account number. Please enter a 10 digits phone number starting with 088 or 099');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 10
        });
    });

    it('should confirm that the transaction is recorded once the phone number is valid', () => {
        phoneNumberInputHandler.handler('0883245234');
        expect(sayText).toHaveBeenCalledWith('Thank you. The transaction data has been recorded successfully. Please work with your agent to proceed with payment of the client');
        expect(stopRules).toHaveBeenCalled();
    });
});
