const {handlerName, getHandler} = require ('./phoneNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');

describe('phone_number_handler', () => {
    var phoneNumberHandler;
    var onPhoneNumberValidated;
    var validRwandaPhoneNumber = '0786235296';
    beforeEach(() => {
        sayText.mockReset();
        onPhoneNumberValidated = jest.fn();
        state.vars.reg_lang = 'en-ke';
        state.vars.country = 'ke';
        phoneNumberHandler = getHandler(onPhoneNumberValidated);
    });
    it('should be a function', () => {
        expect(phoneNumberHandler).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        phoneNumberHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should not call onPhoneNumberValidated if input does not match a valid phone Number ', () => {
        phoneNumberHandler('1');
        expect(onPhoneNumberValidated).not.toHaveBeenCalled();
    });
    it('should show prompt message for retry if input is not a valid phone number', () => {
        phoneNumberHandler('0000');
        expect(sayText).toHaveBeenCalledWith('Invalid entry.Please enter a valid phone number.');
    });
    it('should call promptDigits for the phone number if the input is not a valid phone number format', () => {
        phoneNumberHandler('000');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call the onPhoneNumberValidated handler if the phone number is in correct format', () => {
        phoneNumberHandler('0786991098');
        expect(onPhoneNumberValidated).toHaveBeenCalledWith('0786991098');
    });

    it('should call the onPhoneNumberValidated handler if the phone number is in correct format and the country is Rwanda', () => {
        state.vars.country = 'RW';
        phoneNumberHandler(validRwandaPhoneNumber);
        expect(onPhoneNumberValidated).toHaveBeenCalledWith(validRwandaPhoneNumber);
    });

});