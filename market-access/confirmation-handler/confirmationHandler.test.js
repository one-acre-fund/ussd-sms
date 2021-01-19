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
        expect(notifyELK).toHaveBeenCalled;
    });
    it('should call onConfirmation with True if the user responded with zero',()=>{
        confirmationHandler('0');
        expect(onConfirmation).toHaveBeenCalledWith(true);
    });
    it('should call onConfirmation with False if the user responded responds with anything other zero',()=>{
        confirmationHandler('1');
        expect(onConfirmation).toHaveBeenCalledWith(false);

    });
});
