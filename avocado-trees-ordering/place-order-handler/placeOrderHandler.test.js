const {handlerName,getHandler} = require ('./placeOrderHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification'); 
const {client}  = require('../test-client-data');
var avocadoEligibility = require('../avocado-eligibility/avocadoEligibility');

jest.mock('../avocado-eligibility/avocadoEligibility');
jest.mock('../../notifications/elk-notification/elkNotification');
describe('change_order_handler', () => {

    var onOrderPlaced;
    var placeOrderHandler;
    const minimum_amount_paid = true;
    
    beforeAll(()=>{
        state.vars.client_json = client;
    });
    beforeEach(() => {
        sayText.mockReset();
        JSON.parse = jest.fn();
        onOrderPlaced = jest.fn();
        state.vars.minimum_amount_paid = minimum_amount_paid;
        placeOrderHandler = getHandler(onOrderPlaced);     
    });
    it('should be a function', () => {
        expect(placeOrderHandler).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        placeOrderHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should prompt the user retry if the entered numer is less than 3', () => {
        placeOrderHandler('1');
        expect(sayText).toHaveBeenCalledWith('You have ordered too few avocados, the minimum you can order is 3, please order at least 3');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call onOrderPlaced if the client an eligible order ', () => {
        avocadoEligibility.mockReturnValue({'possibleTrees': 10});
        placeOrderHandler('4');
        expect(onOrderPlaced).toHaveBeenCalledWith('4');
    });
    it('should not show a message saying they don\'t meet requirements if repayment requirement is met', () => {
        var number = 14;
        placeOrderHandler(number);
        expect(sayText).toHaveBeenCalledWith(`You do not yet qualify for ordering ${number}`+
        ' number of trees. Pay at least 500 Frw per each tree you want to order and then try your order again.');
    });
    it('should call onOrderPlaced if the client an eligible order ', () => {
        avocadoEligibility.mockReturnValue({'possibleTrees': 10});
        placeOrderHandler('10');
        expect(onOrderPlaced).toHaveBeenCalledWith('10');
    });
    it('should say', () => {
        avocadoEligibility.mockReturnValue(false);
        var number = 14;
        placeOrderHandler(number);
        expect(sayText).toHaveBeenCalledWith(`You do not yet qualify for ordering ${number}`+
        ' number of trees. Pay at least 500 Frw per each tree you want to order and then try your order again.');
    });
    
});