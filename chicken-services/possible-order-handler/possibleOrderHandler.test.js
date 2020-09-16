const {handlerName,getHandler} = require ('./possibleOrderHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('possible_order_handler', () => {

    var onOrderingConfirmed;
    const minimum_amount_paid = true;
    var possibleOrderHandler;
    var max_chicken = 10;

    beforeEach(() => {
        sayText.mockReset();
        onOrderingConfirmed = jest.fn();
        state.vars.max_chicken = max_chicken;
        state.vars.minimum_amount_paid = minimum_amount_paid;
        possibleOrderHandler = getHandler(onOrderingConfirmed);   
    });
    it('should be a function', () => {
        expect(possibleOrderHandler).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        possibleOrderHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should show a message saying that showing the bounds of number of chickens if they are beyond it', () => {
        project.vars.lang = 'en';
        possibleOrderHandler('15');
        expect(sayText).toHaveBeenCalledWith(`You must confirm a number between 2- ${max_chicken}`
        +'. How many chickens would you like to confirm? 0: Back to main menu');
    });
    
    it('should call the onOrderingConfirmed handler if the repayment is satisfied(between 2 and max)', () => {
        possibleOrderHandler('3');
        expect(onOrderingConfirmed).toBeCalled();
    });
    it('should show prompt for re-entry if unexpected input', () => {
        project.vars.lang = 'en';
        possibleOrderHandler('12');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should show prompt for re-entry if unexpected input(containing decimals)', () => {
        project.vars.lang = 'en';
        possibleOrderHandler('3.5');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
});

