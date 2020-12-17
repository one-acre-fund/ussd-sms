service.vars.lang = 'en';
var changeOrderCofrm = require('./change-order-confirmation/changeOrderConfirmation');
var changeOrderHandler = require('./change-order-handler/changeOrderHandler');
var placeOrderHandler = require('./place-order-handler/placeOrderHandler');
var possibleOrderHandler = require('./possible-order-handler/possibleOrderHandler');
var chickenEligibility = require('./chicken-eligibility/chickenEligibility');
var notifyELK = require('../notifications/elk-notification/elkNotification'); 
var CheckChickenCapByDistrict = require('./check-chicken-cap-by-district/CheckChickenCapByDistrict');
const {client}  = require('./test-client-data'); 

jest.mock('./change-order-confirmation/changeOrderConfirmation');
jest.mock('./change-order-handler/changeOrderHandler');
jest.mock('./place-order-handler/placeOrderHandler');
jest.mock('./possible-order-handler/possibleOrderHandler');
jest.mock('./chicken-eligibility/chickenEligibility');
jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('./check-chicken-cap-by-district/CheckChickenCapByDistrict');

const mockChangeOrderCofrm = jest.fn();
const mockChangeOrderHandler = jest.fn();
const mockPlaceOrderHandler = jest.fn();
const mockPossibleOrderHandler = jest.fn();


chickenEligibility.mockReturnValue(0);

const chickenServices = require('./chickenServices');
const account = 123456789;
const country = 'UG';
const mockCursor = { 
    next: jest.fn(), 
    hasNext: jest.fn()
};
const mockTable = { queryRows: jest.fn() };
var mockRow ={vars: { ordered_chickens: 10, confirmed: 1},save: jest.fn()};

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
        it('should show a place order chicken next season message if no chicken is ordered', () => {
            state.vars.chcken_nber = 0;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith('Sorry, you did not order chickens so you are not allowed to confirm chickens. Order chickens next season!');
            expect(sayText).toHaveBeenCalledTimes(1);
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
        it('should show a chicken_possible_nber message if the client met minumum payment and the number of caps is not reached', () => {
            state.vars.minimum_amount_paid = true;
            CheckChickenCapByDistrict.mockReturnValue(40);
            state.vars.max_chicken = number;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith(`Hello ${client.FirstName} `
            +`you are eligible to purchase ${number} `
            +'number of chickens. How many would you like to confirm? 0: Return home');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should show a chicken_possible_nber message if the client met minumum payment and the number of caps is not reached, but max chicken is grater than cap', () => {
            state.vars.minimum_amount_paid = true;
            CheckChickenCapByDistrict.mockReturnValue(4);
            state.vars.max_chicken = number;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith(`Hello ${client.FirstName} `
            +'you are eligible to purchase 4 number of chickens. How many would you like to confirm? 0: Return home');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should call onPayment Validated if minimum payment is met and the number of caps is not reached', () => {
            state.vars.minimum_amount_paid = true;
            CheckChickenCapByDistrict.mockReturnValue(4);
            state.vars.max_chicken = number;
            chickenServices.start(account, country);
            expect(promptDigits).toHaveBeenCalledWith(possibleOrderHandler.handlerName);
        });
        it('should show a message telling the farmer to try again next month if the number of caps is  reached', () => {
            state.vars.minimum_amount_paid = true;
            CheckChickenCapByDistrict.mockReturnValue(false);
            state.vars.max_chicken = number;
            chickenServices.start(account, country);
            expect(sayText).toHaveBeenCalledWith('We are very sorry, we have reached the limit of chickens for this month. Please try to confirm your chickens again next month!');
        });
    });

    describe('place Order Handler Success callback',()=>{
        var callback;
        beforeEach(() => {
            chickenServices.registerHandlers();
            callback = placeOrderHandler.getHandler.mock.calls[0][0];                
        });
        it('should show the possible number of chicken message and propmt for a number',()=>{
            callback();
            expect(sayText).toHaveBeenCalledWith(`Hello ${client.FirstName} `
            +`you are eligible to purchase ${number} `
            +'number of chickens. How many would you like to confirm? 0: Return home');
            expect(promptDigits).toHaveBeenCalledWith(possibleOrderHandler.handlerName);

        });
    });
   
    describe('possible order handler success callback',()=>{
        var callback;
        beforeEach(() => {
            chickenServices.registerHandlers();
            callback = possibleOrderHandler.getHandler.mock.calls[0][0];                
        });
        it('should show a confirmation message with the number of chiken chosen and prompt for an answer',()=>{
            state.vars.confirmed_number = 3;
            callback();
            expect(sayText).toHaveBeenCalledWith(`You are confirming ${ state.vars.confirmed_number}`+
            ` chickens. Your total credit for chickens is ${ state.vars.confirmed_number *2400}`+
            ' Rwf. Your chickens will be ready within 2 months! 1: Confirm 0: Return home');
            expect(promptDigits).toHaveBeenCalledWith(changeOrderCofrm.handlerName);
        });
    });

    describe('change order confirmation success callback',()=>{
        var callback;
        beforeAll(()=>{
            project.initDataTableById.mockReturnValue(mockTable);
            mockTable.queryRows.mockReturnValue(mockCursor);
        });
        beforeEach(() => {
            chickenServices.registerHandlers();
            callback = changeOrderCofrm.getHandler.mock.calls[0][0];                
        });

        it('shoud set the rows and save the client infos',()=>{
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValue(mockRow);
            callback();
            expect(mockRow.vars.confirmed).toBe(1);
            expect(mockRow.vars.first_name).toBe(client.FirstName);
            expect(mockRow.vars.last_name).toBe(client.LastName);
            expect(mockRow.vars.site).toBe(client.SiteName);
            expect(mockRow.vars.district).toBe(client.DistrictName);
            expect(mockRow.vars.group).toBe(client.GroupName);
            expect(mockRow.vars.ordered_chickens).toBe(state.vars.confirmed_number);
            expect(mockRow.save).toHaveBeenCalled();
        });
        it('should not save if no client is found in the db',()=>{
            mockCursor.hasNext.mockReturnValueOnce(false);
            callback();
            expect(mockRow.save).not.toHaveBeenCalled();

        });
    });
});
