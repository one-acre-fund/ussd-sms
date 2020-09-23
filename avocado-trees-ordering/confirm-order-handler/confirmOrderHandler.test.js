const {handlerName} = require ('./confirmOrderHandler');
const {getHandler} = require('./confirmOrderHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('confirm_order_handler', () => {
    var confirmOrderHandler;
    var onOrderConfirmed;
    var amount = 1000;
    var possibleTree = 3;
    beforeAll(()=>{
        state.vars.possibleTrees = JSON.stringify({'balance': amount  ,'possibleTrees': possibleTree});
    });
    beforeEach(() => {
        sayText.mockReset();
        onOrderConfirmed = jest.fn();
        confirmOrderHandler = getHandler(onOrderConfirmed);
    });
    it('should not call onOrderConfirmed if input is not 1 ', () => {
        confirmOrderHandler('2');
        expect(onOrderConfirmed).not.toHaveBeenCalled();
    });
    it('should call notifyELK ', () => {
        confirmOrderHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should show eligible_repayment_message if input is 2', () => {
        confirmOrderHandler('2');
        expect(sayText).toHaveBeenCalledWith(`You have paid ${amount}`+
        `, so you are qualified to order up to ${possibleTree}`+
        ' trees.  Please remember, new avocado clients must order at least 3 trees. How many would you like to order? Reply with the number of trees you want to order\n99) Return to main menu');
    });
    it('should show order not finalized  if the input is 3', () => {
        confirmOrderHandler('3');
        expect(sayText).toHaveBeenCalledWith('Ordering not finalized. Try again later');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should call reprompt if the user enters an unexpected input', () => {
        state.vars.orderedNumber = amount;
        confirmOrderHandler('9');
        expect(sayText).toHaveBeenCalledWith(`You ordered ${amount}`+
        ' number of avocados\n1) Confirm\n2) Change order\n3) Cancel');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
});