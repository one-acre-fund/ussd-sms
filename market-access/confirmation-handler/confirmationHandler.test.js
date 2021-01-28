var {getHandler} = require('./confirmationHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('confirmation handler test', ()=>{

    var confirmationHandler;
    var onConfirmation;
    beforeAll(()=>{
        onConfirmation = jest.fn();
        confirmationHandler = getHandler(onConfirmation);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        confirmationHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onConfirmation with 0 if the user responded with zero',()=>{
        confirmationHandler('0');
        expect(onConfirmation).toHaveBeenCalledWith('0');
    });
    it('should call onConfirmation with False if the user responded responds with an empty input',()=>{
        confirmationHandler('');
        expect(onConfirmation).toHaveBeenCalledWith(false);

    });
});
