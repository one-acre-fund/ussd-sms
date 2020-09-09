const {getHandler} = require ('./addOrderHandler');
var bundleChoiceHandler = require('../bundle-choice-handler/bundleChoiceHandler');
var {client}  = require('../../client-enrollment/test-client-data'); 

jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../bundle-choice-handler/bundleChoiceHandler');

var notifyELK = require('../../notifications/elk-notification/elkNotification');
describe('account_number_handler', () => {
    var addOrderHandler;
    var onFinalizeOrder, displayBundles;

    beforeAll(()=>{
        onFinalizeOrder = jest.fn();
        displayBundles = jest.fn();
        addOrderHandler = getHandler(onFinalizeOrder, displayBundles);
        state.vars.topUpClient = JSON.stringify(client);

    });

    it('should call notifyELK ', () => {
        addOrderHandler(onFinalizeOrder,displayBundles);
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should dispay bundles and prompt for bundle choices with the bundle choice handlerif the uer chooses 1 to add an order ', () =>{
        addOrderHandler(1);
        expect(displayBundles).toHaveBeenCalledWith(client.DistrictId);
        expect(promptDigits).toHaveBeenCalledWith(bundleChoiceHandler.handlerName);
    });
    it('should call finalized order if the user chooses 2 to finalize ', () =>{
        addOrderHandler(2);
        expect(onFinalizeOrder).toHaveBeenCalled();
    });

});