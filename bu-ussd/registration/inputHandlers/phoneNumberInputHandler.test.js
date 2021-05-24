const phoneNumberInputHandler = require('./phoneNumberInputHandler');
const groupCodeInputHandler = require('./groupCodeInputHandler');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('Phone number input handler', () => {
    beforeEach(() => {
        contact.phone_number = '788664573';
    });
    it('should reprompt the phone number up on empty input ', () => {
        const handler = phoneNumberInputHandler.getHandler('en_bu');
        handler();
        expect(sayText).toHaveBeenCalledWith('This phone number is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });

    it('should reprompt the phone number up on invalid input ', () => {
        const handler = phoneNumberInputHandler.getHandler('en_bu');
        handler(' jdias');
        expect(sayText).toHaveBeenCalledWith('This phone number is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });

    it('should take the contact phone when the user enters 0', () => {
        const handler = phoneNumberInputHandler.getHandler('en_bu');
        handler('0');
        expect(state.vars.phone_number).toEqual('788664573');
    });
    it('should reprompt the phone number up on phone number not within 8-12 digits (more)', () => {
        const handler = phoneNumberInputHandler.getHandler('en_bu');
        handler('0788664573843743');
        expect(sayText).toHaveBeenCalledWith('This phone number is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });

    it('should reprompt the phone number up on phone number not within 8-12 digits (less', () => {
        const handler = phoneNumberInputHandler.getHandler('en_bu');
        handler('078866');
        expect(sayText).toHaveBeenCalledWith('This phone number is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });
    
    it('should prompt for group code when user enters a valid phone', () => {
        const handler = phoneNumberInputHandler.getHandler('en_bu');
        handler('788664573');
        expect(sayText).toHaveBeenCalledWith('Enter Group Code');
        expect(promptDigits).toHaveBeenCalledWith(groupCodeInputHandler.handlerName);
    });
});
