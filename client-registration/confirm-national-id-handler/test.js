const {handlerName} = require ('../national-id-handler/nationalIdHandler');
const {getHandler} = require('./confirmNationalIdHandler');
describe('confirm_national_id', () => {
    var idVerificationHandler;
    var onNationalIdConfirmation;
    beforeEach(() => {
        sayText.mockReset();
        onNationalIdConfirmation = jest.fn();
        idVerificationHandler = getHandler(onNationalIdConfirmation);
        state.vars.country = 'ke';
        state.vars.reg_lang = 'en-ke';
    });
    it('should not call onNationalIdConfirmation if input is not 1 ', () => {
        idVerificationHandler('2');
        expect(onNationalIdConfirmation).not.toHaveBeenCalled();
    });
    it('should show prompt message for national ID input if input is not a valid national Id', () => {
        idVerificationHandler('0');
        expect(sayText).toHaveBeenCalledWith('What is their national ID?');
    });
    it('should call promptDigits for the correct national ID if the input', () => {
        idVerificationHandler('000');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call onNationalIdConfirmation if input is  1 ', () => {
        idVerificationHandler('1');
        expect(onNationalIdConfirmation).toHaveBeenCalled();
    });

});