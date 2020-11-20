var {getHandler} = require('./varietyConfirmationHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var bundleChoiceHandler = require('../bundle-choice-handler/bundleChoiceHandler');
var {client} = require('../../client-enrollment/test-client-data'); 
httpClient.request.mockReturnValue({status: 200});
jest.mock('../../notifications/elk-notification/elkNotification');
describe('order confirmation handler test', ()=>{

    var varietyConfirmationHandler;
    var onBundleSelected,displayBundles;
    beforeAll(()=>{
        state.vars.topUpClient = JSON.stringify(client);
        onBundleSelected = jest.fn();
        displayBundles = jest.fn();
        varietyConfirmationHandler = getHandler(onBundleSelected,displayBundles);
        state.vars.chosenVariety = JSON.stringify([{bundleId: '-2711',bundleInputId: '-11823'}]);
    });

    it('should call ELK',()=>{
        varietyConfirmationHandler();
        expect(notifyELK).toHaveBeenCalled;
    });
    it('should call on bundle selected function if the user chooses 1',()=>{
        varietyConfirmationHandler(1);
        expect(onBundleSelected).toHaveBeenCalledWith(JSON.parse(state.vars.chosenVariety).bundleId,true, JSON.parse(state.vars.chosenVariety).bundleInputId);
    });
    it('should call on display bundles and prompt for bundle choice if the user did not chooses 1(confim)',()=>{
        varietyConfirmationHandler(2);
        expect(displayBundles).toHaveBeenCalledWith(client.DistrictId);
        expect(promptDigits).toHaveBeenCalledWith(bundleChoiceHandler.handlerName);
    });
});