const {handlerName, getHandler} = require ('./nationalIdHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
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
    it('should call the onNationalIdValidated handler if the national Id is correct', () => {
        idVerificationHandler('1234567');
        expect(onNationalIdValidated).toHaveBeenCalledWith('1234567');
    });

});