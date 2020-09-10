var {getHandler} = require('./orderConfirmationHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.fn('../../notifications/elk-notification/elkNotification');
httpClient.request.mockReturnValue({status: 200});
describe('order confirmation handler test', ()=>{

    var orderConfirmationHandler;
    var onOrderConfirmed;
    beforeAll(()=>{
        onOrderConfirmed = jest.fn();
        orderConfirmationHandler = getHandler(onOrderConfirmed);
    });

    it('should call ELK',()=>{
        orderConfirmationHandler();
        expect(notifyELK).toHaveBeenCalled;
    });
    it('should call on order confirmation function if the user chooses 1',()=>{
        orderConfirmationHandler();
        expect(onOrderConfirmed).toHaveBeenCalled;
    });
});