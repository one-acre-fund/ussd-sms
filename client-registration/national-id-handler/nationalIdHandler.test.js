const {handlerName, getHandler} = require ('./nationalIdHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');

var validRwandaNationalId = '1199780036907365';
describe('national_id_handler', () => {
    var idVerificationHandler;
    var onNationalIdValidated;
    beforeEach(() => {
        sayText.mockReset();
        onNationalIdValidated = jest.fn();
        idVerificationHandler = getHandler(onNationalIdValidated);
        state.vars.country = 'ke';
        state.vars.reg_lang = 'en-ke';
    });
    it('should not call onNationalIdValidated if input does not match a valid nationalID ', () => {
        idVerificationHandler('1');
        expect(onNationalIdValidated).not.toHaveBeenCalled();
    });
    it('should call notifyELK ', () => {
        idVerificationHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should show prompt message for retry if input is not a valid national Id', () => {
        idVerificationHandler('0000');
        expect(sayText).toHaveBeenCalledWith('Invalid entry. Please enter a valid national id.');
    });
    it('should call promptDigits for the correct national ID if the input is not a valid national Id', () => {
        idVerificationHandler('000');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call the onNationalIdValidated handler if the national Id is correct(8 or 7 digits and the country is Kenya)', () => {
        idVerificationHandler('1234567');
        expect(onNationalIdValidated).toHaveBeenCalledWith('1234567');
    });

    it('should call the onNationalIdValidated handler if the national Id is correct(16 digits and the country is Rwanda)', () => {
        state.vars.country = 'RW';
        idVerificationHandler(validRwandaNationalId);
        expect(onNationalIdValidated).toHaveBeenCalledWith(validRwandaNationalId);
    });
    it('should call reprompt for national ID and not call the onNationalIdValidated handler, if the national Id is not correct(16 digits and the country is Rwanda)', () => {
        idVerificationHandler(0);
        expect(sayText).toHaveBeenCalledWith('Invalid entry. Please enter a valid national id.');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
        expect(onNationalIdValidated).not.toHaveBeenCalled();
    });


});