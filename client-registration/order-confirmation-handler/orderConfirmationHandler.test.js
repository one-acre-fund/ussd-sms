var {getHandler} = require('./orderConfirmationHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var {client}  = require('../../client-enrollment/test-client-data'); 
jest.mock('../../notifications/elk-notification/elkNotification');
httpClient.request.mockReturnValue({status: 200});
describe('order confirmation handler test', ()=>{

    var orderConfirmationHandler;
    var onOrderConfirmed,displayBundles;
    var bundleArray = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'},{'bundleId': '-2960','bundleInputId': '-11920','bundleName': 'Red Onion','price': '180','inputName': 'Red Creole'}];
    beforeAll(()=>{
        onOrderConfirmed = jest.fn();
        displayBundles = jest.fn();
        orderConfirmationHandler = getHandler(onOrderConfirmed,displayBundles);
        state.vars.orders =   JSON.stringify(bundleArray);
        state.vars.newClient = JSON.stringify(client);
    });

    it('should call ELK',()=>{
        orderConfirmationHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call on order confirmation function if the user chooses 1',()=>{
        orderConfirmationHandler(1);
        expect(onOrderConfirmed).toHaveBeenCalled();
    });
    it('should not call on order confirmation function if the user chooses anthing other than 1',()=>{
        orderConfirmationHandler(4);
        expect(onOrderConfirmed).not.toHaveBeenCalled();
    });
    it('should remove the last order if the client chooses 2',()=>{
        bundleArray.pop();
        orderConfirmationHandler(2);
        expect(state.vars.orders).toEqual(JSON.stringify(bundleArray));
    });
    it('should display  bundles if the client chooses 2',()=>{
        orderConfirmationHandler(2);
        expect(displayBundles).toHaveBeenCalled();
    });
    
});