var avocadoEligibility = require('./avocado-eligibility/avocadoEligibility');
var placeOrderHandler = require('./place-order-handler/placeOrderHandler');
var confirmOrderHandler = require('./confirm-order-handler/confirmOrderHandler');
const avocadoTreesOrdering = require('./avocadoTreesOrdering');
const {client}  = require('./test-client-data');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var enrollOrder = require('../Roster-endpoints/enrollOrder');

jest.mock('./avocado-eligibility/avocadoEligibility');
jest.mock('./place-order-handler/placeOrderHandler');
jest.mock('./confirm-order-handler/confirmOrderHandler');
jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('./avocado-eligibility/avocadoEligibility');
jest.mock('../Roster-endpoints/enrollOrder');


const mockCofrmOrderHandler = jest.fn();
const mockPlaceOrderHandler = jest.fn();


const account = 123456789;
const country = 'RW';
const lang = 'en';

describe('avocadoServices',()=>{
    
    beforeEach(() => {
        placeOrderHandler.getHandler.mockReturnValue(mockPlaceOrderHandler);
        confirmOrderHandler.getHandler.mockReturnValue(mockCofrmOrderHandler);
        
    });
    it('should have a start function', () => {
        expect(avocadoTreesOrdering.start ).toBeInstanceOf(Function);
    });
    it('should add Order Confirmation handler to input handlers', () => {
        avocadoTreesOrdering.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(confirmOrderHandler.handlerName, confirmOrderHandler.getHandler());            
    });
    it('should add place Order Handler to input handlers', () => {
        avocadoTreesOrdering.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(placeOrderHandler.handlerName, placeOrderHandler.getHandler());            
    });
    describe('start', () => {
        var balance = 10000;
        var possibleTree = 5;
        beforeAll(() => {
            state.vars.client_json = JSON.stringify(client);
        });
        it('should set the  state vars to the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            state.vars.country = '';
            avocadoTreesOrdering.start(account, country,lang);
            expect(state.vars).toMatchObject({account,country});
        });
        it('should call notifyELK ', () => {
            avocadoTreesOrdering.start(account, country, lang);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should display possible number to order and prompt for input',()=>{
            avocadoEligibility.mockReturnValue({'balance': balance, 'possibleTrees': possibleTree});
            avocadoTreesOrdering.start(account, country,lang);
            expect(sayText).toHaveBeenCalledWith(`You have paid ${balance}`+
            `, so you are qualified to order up to ${possibleTree}`+
            ' trees.  Please remember, new avocado clients must order at least 3 trees. How many would you like to order? Reply with the number of trees you want to order\n99) Return to main menu');
        });
        it('should display prepayment not satified if the possible nuber of tree is less than 3',()=>{
            avocadoEligibility.mockReturnValue({'balance': balance, 'possibleTrees': 2});
            avocadoTreesOrdering.start(account, country,lang);
            expect(sayText).toHaveBeenCalledWith('You do not yet qualify for ordering trees. Pay at least 500 Frw per each tree you want to order and then try your order again.');
        });
        it('should display an error message if the client is not found in the table',()=>{
            avocadoEligibility.mockReturnValue(false);
            avocadoTreesOrdering.start(account, country,lang);
            expect(sayText).toHaveBeenCalledWith('Sorry, your account number is not found');
        });
    });
    describe('place order successful callback',()=>{
        var callback;
        var number = 4;
        beforeEach(() => {
            avocadoTreesOrdering.registerHandlers();
            callback = placeOrderHandler.getHandler.mock.calls[0][0];                
        });
        it('should show the possible number of avocado message and propmt for a number',()=>{
            callback(4);
            expect(sayText).toHaveBeenCalledWith(`You ordered ${number}`+
            ' number of avocados\n1) Confirm\n2) Change order\n3) Cancel');
            expect(promptDigits).toHaveBeenCalledWith(confirmOrderHandler.handlerName);

        });
    });
    describe('place order successful callback',()=>{
        var callback;
        var quantity = 10;
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockTable = { queryRows: jest.fn(), createRow: jest.fn() };
        project.initDataTableById.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
        mockCursor.hasNext.mockReturnValue(true);
        var mockRow = {save: jest.fn()};
        mockTable.createRow.mockReturnValue(mockRow);
        var requestBundles = [{
            'bundleId': '-3217',
            'bundleQuantity': quantity,
            'inputChoices': [-13392]
        }];
        beforeAll(()=>{
            state.vars.orderedNumber = quantity;
            state.vars.client_json = JSON.stringify(client);
        });
        beforeEach(() => {
            avocadoTreesOrdering.registerHandlers();
            callback = confirmOrderHandler.getHandler.mock.calls[0][0];                
        });
        it('should call enroll order with the request data',()=>{
            callback();
            expect(enrollOrder).toHaveBeenCalledWith({'districtId': client.DistrictId,
                'siteId': client.SiteId,
                'groupId': client.GroupId,
                'accountNumber': client.AccountNumber,
                'clientId': client.ClientId,
                'isGroupLeader': 'false',
                'clientBundles': requestBundles});
        });
       
        it('should call enroll order with the request data if the client is new( groupId is null)',()=>{
            client.GroupId = null;
            state.vars.client_json = JSON.stringify(client);
            var new_Group = 30;
            mockRow ={vars: { groupId: new_Group, a_avokaqty: 3}, save: jest.fn()};
            mockCursor.next.mockReturnValue(mockRow);
            callback();
            expect(enrollOrder).toHaveBeenCalledWith({'districtId': client.DistrictId,
                'siteId': client.SiteId,
                'groupId': new_Group,
                'accountNumber': client.AccountNumber,
                'clientId': client.ClientId,
                'isGroupLeader': 'false',
                'clientBundles': requestBundles});
        });
        it('should send a confirmation sms as well as display it if the enrollment succeded ',()=>{
            client.GroupId = 10;
            project.vars.sms_push_route = 111;
            state.vars.client_json = JSON.stringify(client);
            state.vars.orderedNumber = quantity;
            enrollOrder.mockReturnValue(true);
            callback();
            var message = `Your order of ${quantity}`+
            ' avocados has been placed. Thank you for ordering avocados with Tubura. The distribution of these trees is scheduled to start in Mid-October and end by November.';
            expect(sayText).toHaveBeenCalledWith(message);
            expect( project.sendMessage).toHaveBeenCalledWith({'to_number': contact.phone_number, 'route_id': 111,'content': message});
        });
        it('should create a row if the the client is new and their info is not found on the orders table',()=>{
            mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
            callback();
            expect(mockTable.createRow).toHaveBeenCalledWith({vars: {
                'avoka_jit': state.vars.orderedNumber,
                'account_number': state.vars.account,
                'confirmed': '1'
            }});

        });
        it('should diplay an error message saying enrollment not complete if an error occurs',()=>{
            enrollOrder.mockReturnValue(false);
            callback();
            expect(sayText).toHaveBeenCalledWith('Ordering not finalized. Try again later');
        });
        it('should diplay an error message if a group is not found ',()=>{
            client.GroupId = null;
            state.vars.client_json = JSON.stringify(client);
            mockCursor.hasNext.mockReturnValue(false);
            callback();
            expect(sayText).toHaveBeenCalledWith('Ordering not finalized. Try again later');
        });

    });
});