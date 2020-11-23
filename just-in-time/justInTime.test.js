const accountNumberHandler = require('./account-number-handler/accountNumberHandler');
const bundleChoiceHandler = require('./bundle-choice-handler/bundleChoiceHandler');
const addOrderHandler = require('./add-order-handler/addOrderHandler');
const orderConfirmationHandler = require('./order-confirmation-handler/orderConfirmationHandler');
const varietyChoiceHandler = require('./variety-choice-handler/varietyChoiceHandler');
const varietyConfirmationHandler = require('./variety-confirmation-handler/varietyConfirmationHandler');
const justInTime = require('./justInTime');
var getPhoneNumber = require('../shared/rosterApi/getPhoneNumber');
var {client}  = require('../client-enrollment/test-client-data');
var notifyELK = require('../notifications/elk-notification/elkNotification');

jest.mock('../notifications/elk-notification/elkNotification');
jest.mock('./account-number-handler/accountNumberHandler');
jest.mock('./bundle-choice-handler/bundleChoiceHandler');
jest.mock('./add-order-handler/addOrderHandler');
jest.mock('./order-confirmation-handler/orderConfirmationHandler');
jest.mock('./variety-choice-handler/varietyChoiceHandler');
jest.mock('./variety-confirmation-handler/varietyConfirmationHandler');
jest.mock('../shared/rosterApi/getPhoneNumber');

const mockAccountNumberHandler = jest.fn();
const mockBundleChoiceHandler = jest.fn();
const mockAddOrderHandler = jest.fn();
const mockOrderConfirmationHandler = jest.fn();
const mockVarietyChoiceHandler = jest.fn();
const mockVarietyConfirmationHandler = jest.fn();

const account = 123456789;
const country = 'KE';
const jitLang = 'en-ke';
state.vars.jitLang = 'en-ke';
state.vars.topUpClient = JSON.stringify(client);
const phoneNumber = '0786182097';
var mockRows = [{vars: {'bundleId': '-2009','bundleInputId': '-1709','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}},{vars: {'bundleId': '-9009','bundleInputId': '-5709','bundle_name': 'third possible name bundle','price': '6251','input_name': 'third input'}},{vars: {'bundleId': '-1009','bundleInputId': '-8709','bundle_name': 'fourth possible name bundle','price': '5251','input_name': 'fourth input'}},{vars: {'bundleId': '-2009','bundleInputId': '-18909','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}}];
var mockBundleInputs = [{'bundleId': '-2009','bundleInputId': '-1709','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'},{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'},{'bundleId': '-1009','bundleInputId': '-8709','bundleName': 'fourth possible name bundle','price': '5251','inputName': 'fourth input'},{'bundleId': '-2009','bundleInputId': '-18909','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'}];
var mockMaizeRows = [{vars: {'bundleId': '-2009','bundleInputId': '-1709','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}},{vars: {'bundleId': '-9009','bundleInputId': '-5709','bundle_name': 'third possible name bundle','price': '6251','input_name': 'third input'}}];
var mockRow = {vars: {'bundleId': '-3009','bundleInputId': '-12109','bundle_name': 'Knapsack Sprayer','price': '2251','input_name': 'Knapsack Sprayer'}};
var mockBundleInput = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'}];

describe('clientRegistration', () => {

    it('should have a start function', () => {
        expect(justInTime.start).toBeInstanceOf(Function);
    });
    beforeAll(()=>{
        state.vars.jitLang = jitLang;
        state.vars.topUpClient = JSON.stringify(client);
    });
    beforeEach(() => {
        accountNumberHandler.getHandler.mockReturnValue(mockAccountNumberHandler);
        bundleChoiceHandler.getHandler.mockReturnValue(mockBundleChoiceHandler);
        addOrderHandler.getHandler.mockReturnValue(mockAddOrderHandler);
        orderConfirmationHandler.getHandler.mockReturnValue(mockOrderConfirmationHandler);
        varietyChoiceHandler.getHandler.mockReturnValue(mockVarietyChoiceHandler);
        varietyConfirmationHandler.getHandler.mockReturnValue(mockVarietyConfirmationHandler);

    });
    it('should add the account number handler to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(accountNumberHandler.handlerName, accountNumberHandler.getHandler());            
    });
    it('should add the bundle Choice Handler  to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(bundleChoiceHandler.handlerName, bundleChoiceHandler.getHandler());            
    });
    it('should add the add order handler to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(addOrderHandler.handlerName, addOrderHandler.getHandler());            
    });
    it('should add the order  confirmation handler to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(orderConfirmationHandler.handlerName, orderConfirmationHandler.getHandler());            
    });
    it('should add the variety choice handler to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(varietyChoiceHandler.handlerName, varietyChoiceHandler.getHandler());            
    });
    it('should add the variety confirmation handler to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(varietyConfirmationHandler.handlerName, varietyConfirmationHandler.getHandler());            
    });
    describe('Account number handler success callback', () => {
        var callback;
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockTable = { queryRows: jest.fn() };
        mockTable.queryRows.mockReturnValue(mockCursor);
        
        project.initDataTableById.mockReturnValue(mockTable);
        state.vars.orders =  ' ';
        state.vars.jitLang ='en-ke';
        beforeEach(() => {
            justInTime.registerHandlers();
            callback = accountNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should not display a message saying that the prepayment is not one if the prepayment consition is not met',()=>{
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
        });
        it('should display  the bundles if the prepayment condition is satified',()=>{
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow);
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockRow.vars.bundle_name}`+
            ` ${mockRow.vars.price}`+
            '\n');
        });
        it('should display a the bundles with next and previous options if the prepayment condition is satified and there is a lot of bundles',()=>{
    
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[1]).mockReturnValueOnce(mockRows[2]);
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockRow.vars.bundle_name}`+
            ` ${mockRow.vars.price}`+
            `\n2) ${mockRows[0].vars.bundle_name}`+
            ` ${mockRows[0].vars.price}`+
            `\n3) ${mockRows[1].vars.bundle_name}`+
            ` ${mockRows[1].vars.price}`+
            '\n77)Next page');
        });
        it('should display only unique bundles(if two bundle inputs in the same bundle are found) if the prepayment condition is satified ', () => {

            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[3]);
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockRow.vars.bundle_name}`+
            ` ${mockRow.vars.price}`+
            `\n2) ${mockRows[0].vars.bundle_name}`+
            ` ${mockRows[0].vars.price}`+
            '\n');
        });
        it('should remove maize bundles from the displayed bundles if the prepayment condition is satified and the client already choosed a maize bundle',()=>{
            
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[1]).mockReturnValueOnce(mockMaizeRows[0]).mockReturnValueOnce(mockMaizeRows[1]);
            state.vars.orders = JSON.stringify([mockMaizeRows[0]]);
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockRow.vars.bundle_name}`+
            ` ${mockRow.vars.price}`+
            `\n2) ${mockRows[0].vars.bundle_name}`+
            ` ${mockRows[0].vars.price}`+
            '\n');
        });
        it('should display a message saying that the prepayment condition is not satified if the remaining loan is greater than 500', () => {
            client.BalanceHistory[0].TotalCredit = 5000;
            client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 0;
            var amount = 500;
            state.vars.topUpClient = JSON.stringify(client);
            callback();
            expect(sayText).toHaveBeenCalledWith(`You do not qualify for a top up, pay at least ${amount}`+
            ' to qualify.');
        });
    });
    describe('bundle Choice Handler successfull callback',()=>{
        var callback;
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockRow = {vars: {'bundleId': '-2009','bundleInputId': '-1709','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}};
        beforeAll(() => {
            const mockTable = { queryRows: jest.fn()};
            mockTable.queryRows.mockReturnValue(mockCursor);
            project.initDataTableById.mockReturnValue(mockTable);
        });
        beforeEach(() => {
            justInTime.registerHandlers();
            callback = bundleChoiceHandler.getHandler.mock.calls[0][0];    
            state.vars.chosenMaizeBundle =  ' ';      
        });

        it('should display the varieties for the bundle choosed, if the bundle has multiple varieties',()=>{
            state.vars.varietyBundleId = -2009;
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow);
            callback(mockBundleInputs[0].bundleId);
            expect(sayText).toHaveBeenCalledWith(`Select seed variety\n1) ${mockBundleInputs[0].inputName}`+
            `\n2) ${mockBundleInputs[3].inputName}`+
            '\n');
        });
        it('should display the order placed by the user and prompt to add order or finalize order',()=>{
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow); 
            state.vars.orders = ' ';
            var orderMessage = mockBundleInputs[0].bundleName + ' ' + mockBundleInputs[0].price + '\n';
            callback(mockBundleInputs[0].bundleId);
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n 1) Add product\n 2) Finish ordering\n 3) Go back');
            expect(promptDigits).toHaveBeenCalledWith(addOrderHandler.handlerName);
        });

    });
    describe('order Confirmation Handler successfull callback',()=>{
        var callback;
        const mockTable = { queryRows: jest.fn(), createRow: jest.fn() };
        const mockRow = {save: jest.fn()};
        var orders = [{'bundleName': 'Maize','price': 1000},{'bundleName': 'Pesticide','price': 3000}];
        var ordersMessage = orders[0].bundleName + ' ' + orders[0].price + ' '+orders[1].bundleName + ' ' + orders[1].price+' ';
        beforeAll(()=>{
            state.vars.orders = JSON.stringify(orders);
        });
        beforeEach(() => {
            justInTime.registerHandlers();
            callback = orderConfirmationHandler.getHandler.mock.calls[0][0];           
        });

        it('should send a message confirming the order is complete if the order is saved in roster',()=>{
            httpClient.request.mockReturnValue({status: 201});
            contact.phone_number = phoneNumber;
            mockTable.createRow.mockReturnValueOnce(mockRow);
            project.initDataTableById.mockReturnValue(mockTable);
            var message = `Thank you for topping-up through JiT. Your order is ${ordersMessage}`+
            ' Reach out to CE through *689# if this  order is not correct';
            callback();
            expect(sayText).toHaveBeenCalledWith(message);
            expect(project.sendMessage).toHaveBeenCalledWith({content: message, to_number: phoneNumber});
        });
        it('should send a message to the stored client\'s phone confirming the order is complete if the order is saved in roster',()=>{
            mockTable.createRow.mockReturnValueOnce(mockRow);
            project.initDataTableById.mockReturnValue(mockTable);
            var inactive_number = {'PhoneNumber': '0786182098', 'IsInactive': false};
            var active_number ={'PhoneNumber': '0786182098', 'IsInactive': true};
            getPhoneNumber.mockReturnValue([inactive_number, active_number]);
            var message = `Thank you for topping-up through JiT. Your order is ${ordersMessage}`+
            ' Reach out to CE through *689# if this  order is not correct';
            callback();
            expect(sayText).toHaveBeenCalledWith(message);
            expect(project.sendMessage).toHaveBeenCalledWith({content: message, to_number: active_number.PhoneNumber});
        });
        it('should display a message asking the user to try again later the order is not saved in roster',()=>{
            httpClient.request.mockReturnValue({status: 500});
            callback();
            expect(sayText).toHaveBeenCalledWith('Please try again later. Most people are applying right now!');
        });
    });

    describe('variety Choice Handler success callback',()=>{
        var callback;
        beforeEach(() => {
            justInTime.registerHandlers();
            callback = varietyChoiceHandler.getHandler.mock.calls[0][0]; 
            state.vars.bundleInputs =  JSON.stringify(mockBundleInputs);           
        });

        it('should display a confirm variety message and prompt for input',()=>{
            callback(mockBundleInputs[0]);
            expect(sayText).toHaveBeenCalledWith(`Top-up with ${mockBundleInputs[0].bundleName}`+
            ` and ${mockBundleInputs[0].inputName}`+
            '\n1) Confirm\n2) Cancel');
            expect(promptDigits).toHaveBeenCalledWith(varietyConfirmationHandler.handlerName);
        });
 
    });
    describe('variety Confirmation Handler successfull callback',()=>{
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockRow = {vars: {'bundleId': '-2009','bundleInputId': '-1709','bundle_name': 'Second possible name bundle','price': '2251','input_name': 'second input'}};
        beforeAll(() => {
            const mockTable = { queryRows: jest.fn()};
            mockTable.queryRows.mockReturnValue(mockCursor);
            project.initDataTableById.mockReturnValue(mockTable);
        });
        var callback;
        beforeEach(() => {
            justInTime.registerHandlers();
            state.vars.orders = ' ';
            callback = varietyConfirmationHandler.getHandler.mock.calls[0][0];    
            state.vars.bundleInputs =  JSON.stringify(mockBundleInputs);        
        });
        it('should show the order placed',()=>{
            state.vars.chosenMaizeBundle = ' ';
            state.vars.varietyBundleId = -2009;
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow);
            callback(mockBundleInputs[3].bundleId,true,mockBundleInputs[3].bundleInputId);
            var orderMessage = mockBundleInputs[3].bundleName + ' ' + mockBundleInputs[3].price + '\n';
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n 1) Add product\n 2) Finish ordering\n 3) Go back');

        });
    });
    describe('add Order Handler successfull callback',()=>{
        var callback;
        beforeEach(() => {
            justInTime.registerHandlers();
            state.vars.orders = JSON.stringify(mockBundleInput);
            callback = addOrderHandler.getHandler.mock.calls[0][0];          
        });
        it('should show the order placed',()=>{
            callback();
            var orderMessage = mockBundleInput[0].bundleName + ' ' + mockBundleInput[0].price + '\n';
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n1) Confirm order\n 2) Go back');
        });
    });

    describe('start', () => {
        it('should set the  state vars to match the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            state.vars.jitLang = '';
            justInTime.start(account, country,jitLang);
            expect(state.vars).toMatchObject({account,country,jitLang});
        });
        it('should call notifyELK', () => {
            justInTime.start(account, country,jitLang);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should show a message asking for the account number for the farmer to top up', () => {
            justInTime.start(account, country, jitLang);
            expect(sayText).toHaveBeenCalledWith('Please reply with the account number of the farmer who want to top-up.');
            expect(sayText).toHaveBeenCalledTimes(1);
        });
        it('should prompt for the account number for the farmer to top up', () => {
            justInTime.start(account, country, jitLang);
            expect(promptDigits).toHaveBeenCalledWith(accountNumberHandler.handlerName);
            expect(promptDigits).toHaveBeenCalledTimes(1);
        });
    });
});