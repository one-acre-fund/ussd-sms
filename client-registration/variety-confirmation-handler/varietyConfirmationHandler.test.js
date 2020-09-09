var {getHandler} = require('./varietyConfirmationHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

httpClient.request.mockReturnValue({status: 200});
jest.mock('../../notifications/elk-notification/elkNotification');
describe('order confirmation handler test', ()=>{

    var varietyConfirmationHandler;
    var onBundleSelected;
    beforeAll(()=>{
        onBundleSelected = jest.fn();
        varietyConfirmationHandler = getHandler(onBundleSelected);
        state.vars.chosenVariety = JSON.stringify([{bundleId: '-2711',bundleInputId: '-11823'}]);
    });

    it('should call ELK',()=>{
        varietyConfirmationHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call on bundle selected function if the user chooses 1',()=>{
        varietyConfirmationHandler(1);
        expect(onBundleSelected).toHaveBeenCalledWith(JSON.parse(state.vars.chosenVariety).bundleId,true, JSON.parse(state.vars.chosenVariety).bundleInputId);
    });
});