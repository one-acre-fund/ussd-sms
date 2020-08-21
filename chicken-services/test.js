var changeOrderCofrm = require('./change-order-confirmation');
var changeOrderHandler = require('./change-order-handler');
var placeOrderHandler = require('./place-order-handler');
var possibleOrderHandler = require('./possible-order-handler');
var chickenEligibility = require('./chicken-eligibility/index');
var notifyELK = require('../notifications/elk-notification/elkNotification'); 
const {client}  = require('./test-client-data'); 

jest.mock('./change-order-confirmation');
jest.mock('./change-order-handler');
jest.mock('./place-order-handler');
jest.mock('./possible-order-handler');
jest.mock('./chicken-eligibility');

const mockChangeOrderCofrm = jest.fn();
const mockChangeOrderHandler = jest.fn();
const mockPlaceOrderHandler = jest.fn();
const mockPossibleOrderHandler = jest.fn();


chickenEligibility.mockReturnValue(0);

const chickenServices = require('.');
const account = 123456789;
const country = 'UG';
describe('ChickenServices', () => {

    it('should have a start function', () => {
        expect(chickenServices.start ).toBeInstanceOf(Function);
    });
    beforeEach(() => {
        changeOrderCofrm.getHandler.mockReturnValue(mockChangeOrderCofrm);
        changeOrderHandler.getHandler.mockReturnValue(mockChangeOrderHandler);
        placeOrderHandler.getHandler.mockReturnValue(mockPlaceOrderHandler);
        possibleOrderHandler.getHandler.mockReturnValue(mockPossibleOrderHandler);
        
    });
    it('should add change Order Cofirmation handler to input handlers', () => {
        chickenServices.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(changeOrderCofrm.handlerName, changeOrderCofrm.getHandler());            
    });
    it('should add changeOrderHandler to input handlers', () => {
        chickenServices.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(changeOrderHandler.handlerName, changeOrderHandler.getHandler());            
    });
    it('should add placeOrderHanler to input handlers', () => {
        chickenServices.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(placeOrderHandler.handlerName, placeOrderHandler.getHandler());            
    });
    it('should add possibleOrderHandler to input handlers', () => {
        chickenServices.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(possibleOrderHandler.handlerName, possibleOrderHandler.getHandler());            
    });

    var number = 10;
    describe('start', () => {
        beforeAll(() => {
            state.vars.client_json = JSON.stringify(client);
        });
        beforeEach(() => {
            state.vars.client_json = JSON.stringify(client);
            sayText.mockClear();
            promptDigits.mockClear();
            state.vars={};
            JSON.parse = jest.fn().mockImplementation(() => {
                return client ;
            });
        });
    
        it('should set the  state vars to the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            chickenServices.start(account, country);
            expect(state.vars).toMatchObject({account,country});
        });
        it('should call notifyELK ', () => {
            chickenServices.start(account, country);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should show a place order chicken message if no chicken ordered', () => {
            state.vars.chcken_nber = 0;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith('Press 1 if you\'d like to order and confirm chickens 1: Continue 0: Return home');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should show a prompt placeOrderHandler if order is no chicken ordered', () => {
            state.vars.chcken_nber = 0;
            chickenServices.start(account, country);
            expect(promptDigits).toHaveBeenCalledWith(placeOrderHandler.handlerName);
            expect(promptDigits).toHaveBeenCalledTimes(1);
        });
        it('should show a change chicken message if chicken confimed', () => {
            state.vars.confirmed_chicken = true;
            state.vars.chcken_nber = 4;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith(`Hello ${client.FirstName} `+
            `You have already confirmed ${state.vars.chcken_nber} `+
            'number of chicken. 1: Change confirmation 0: Return home');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should prompt for changing order if chicken is aleady confirmed', () => {
            state.vars.confirmed_chicken = true;
            state.vars.chcken_nber = 4;
            chickenServices.start(account, country);
            expect(promptDigits).toHaveBeenCalledWith(changeOrderHandler.handlerName);
            expect(promptDigits).toHaveBeenCalledTimes(1);
        });
        it('should show a chicken_no_minimum_prepayment message if client didn\'t meet minumum payment', () => {
            state.vars.minimum_amount_paid = false;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith('Sorry, you have not reached your minimum prepayment amount to confirm chickens. Please complete your prepayment if you want to confirm them.');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should not prompt for any digits if minimum payment is not met', () => {
            state.vars.minimum_amount_paid = false;
            chickenServices.start(account, country);
            expect(promptDigits).not.toBeCalled();
        });
        it('should show a chicken_possible_nber message if the client met minumum payment', () => {
            state.vars.minimum_amount_paid = true;
            state.vars.max_chicken = number;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith(`Hello ${client.FirstName} `
            +`you are eligible to purchase 2 - ${number} `
            +'number of chickens. How many would you like to confirm? 0: Return home');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should call onPayment Validated if minimum payment is met', () => {
            state.vars.minimum_amount_paid = true;
            state.vars.max_chicken = number;
            chickenServices.start(account, country);
            expect(promptDigits).toHaveBeenCalledWith(possibleOrderHandler.handlerName);
        });
    });


});
