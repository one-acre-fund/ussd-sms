const {handlerName} = require ('../phone-number-handler/phoneNumberHandler');
const {getHandler} = require('./confirmPhoneNumberHandler');

describe('phone_number_handler', () => {
    var phoneNumberHandler;
    var onPhoneNumberConfirmed;
    beforeEach(() => {
        sayText.mockReset();
        onPhoneNumberConfirmed = jest.fn();
        state.vars.reg_lang = 'en';
        state.vars.country = 'ke';
        phoneNumberHandler = getHandler(onPhoneNumberConfirmed);
    });
    it('should be a function', () => {
        expect(phoneNumberHandler).toBeInstanceOf(Function);
    });
    it('should not call onPhoneNumberConfirmed if input is not 1', () => {
        phoneNumberHandler('7');
        expect(onPhoneNumberConfirmed).not.toHaveBeenCalled();
    });
    it('should show prompt message for phone number input if input is not 1', () => {
        phoneNumberHandler('0000');
        expect(sayText).toHaveBeenCalledWith('Reply with their Phone number of the farmer');
    });
    it('should call promptDigits for the phone number if the input is not 1', () => {
        phoneNumberHandler('000');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call the onPhoneNumberConfirmed handler if the input is 1', () => {
        phoneNumberHandler('1');
        expect(onPhoneNumberConfirmed).toHaveBeenCalledWith();
    });

});