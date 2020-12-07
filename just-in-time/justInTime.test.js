const accountNumberHandler = require('./account-number-handler/accountNumberHandler');
const bundleChoiceHandler = require('./bundle-choice-handler/bundleChoiceHandler');
const addOrderHandler = require('./add-order-handler/addOrderHandler');
const orderConfirmationHandler = require('./order-confirmation-handler/orderConfirmationHandler');
const varietyChoiceHandler = require('./variety-choice-handler/varietyChoiceHandler');
const varietyConfirmationHandler = require('./variety-confirmation-handler/varietyConfirmationHandler');
const orderMoreHandler = require('./order-more-handler/orderMoreHandler');
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
jest.mock('./order-more-handler/orderMoreHandler');

const mockAccountNumberHandler = jest.fn();
const mockBundleChoiceHandler = jest.fn();
const mockAddOrderHandler = jest.fn();
const mockOrderConfirmationHandler = jest.fn();
const mockVarietyChoiceHandler = jest.fn();
const mockVarietyConfirmationHandler = jest.fn();
const mockOrderMoreHandler = jest.fn();

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
        orderMoreHandler.getHandler.mockReturnValue(mockOrderMoreHandler);

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
    it('should add the order more handler to input handlers', () => {
        justInTime.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(orderMoreHandler.handlerName, orderMoreHandler.getHandler());
    });
    describe('Account number handler success callback', () => {
        var callback;
        var orders = [];
        var maizeOrder,secondOrder;
        orders.push(mockBundleInput[0]);
        maizeOrder = JSON.parse(JSON.stringify(mockBundleInputs[0]));
        maizeOrder.bundleName = '0.5 Maize Acre';
        maizeOrder.price = 4950;
        maizeOrder.quantity = 0.5;
        orders.push(maizeOrder);
        secondOrder = JSON.parse(JSON.stringify(mockBundleInputs[0]));
        secondOrder.bundleName = '0.25 Maize Acre';
        secondOrder.price = 2830;
        secondOrder.quantity = 0.25;
        orders.push(secondOrder);
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockTable = { queryRows: jest.fn() };
        mockTable.queryRows.mockReturnValue(mockCursor);
        
        project.initDataTableById.mockReturnValue(mockTable);
        state.vars.orders =  ' ';
        state.vars.jitLang ='en-ke';
        beforeEach(() => {
            jest.clearAllMocks();
            justInTime.registerHandlers();
            callback = accountNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should not display a message saying that the prepayment is not one if the prepayment consition is not met',()=>{
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
        });
        it('should display  the bundles if the prepayment condition is satified for first time clients',()=>{
            // mocking the past ordered products
            mockCursor.hasNext.mockReturnValueOnce(false);
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow);
            callback();
            expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select a product\n1) ${mockRow.vars.bundle_name}`+
            ` ${mockRow.vars.price}`+
            '\n');
        });
<<<<<<< HEAD

        it('should prompt for ordering more products for the returning clients',()=>{
            // mocking the past ordered products
            const toppedUppBundles = [{'bundleId': '-3009','bundleInputId': '-12109','bundleName': 'Knapsack Sprayer','price': '2251','inputName': 'Knapsack Sprayer'}];
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce({vars: {order: JSON.stringify(toppedUppBundles)}});
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow);
            callback();
            expect(sayText).toHaveBeenCalledWith('Your past order (1 products):\n' +
            'Knapsack Sprayer 2251; \n' +
            'You can order 2 more products\n' +
            '1. Order more\n' +
            '2. Cancel');
            expect(promptDigits).toHaveBeenCalledWith(orderMoreHandler.handlerName);
        });
        it('should display the maize bundle size(0.5 and 0.25) of maize bundles if a maize bundle is available and the client did not order anything',()=>{
            // mocking the past ordered products
            mockCursor.hasNext.mockReturnValueOnce(false);
=======
        it('should display the maize bundle size(0.5 and 0.25) of maize bundles if a maize bundle is available and the client did not order anything',()=>{
>>>>>>> master
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[0]);//.mockReturnValueOnce(mockMaizeRows[0]).mockReturnValueOnce(mockMaizeRows[1]);
            state.vars.orders = ' ';
            callback();
            expect(state.vars.bundles).toEqual(JSON.stringify(orders));
        });
        it('should display the maize bundle size(0.5 and 0.25) of maize bundles if a maize bundle is available and the client ordered other bundles than maize',()=>{
<<<<<<< HEAD
            // mocking the past ordered products
            mockCursor.hasNext.mockReturnValueOnce(false);
=======
>>>>>>> master
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[0]);//.mockReturnValueOnce(mockMaizeRows[0]).mockReturnValueOnce(mockMaizeRows[1]);
            state.vars.orders = JSON.stringify(mockRows[1]);
            callback();
            expect(state.vars.bundles).toEqual(JSON.stringify(orders));
        });
        it('should display a the bundles with next and previous options if the prepayment condition is satified and there is a lot of bundles',()=>{
            // mocking the past ordered products
            mockCursor.hasNext.mockReturnValueOnce(false);
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
            // mocking the past ordered products
            mockCursor.hasNext.mockReturnValueOnce(false);
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
            // mocking the past ordered products
            mockCursor.hasNext.mockReturnValueOnce(false);
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
        it('should display a the varieties for the bundle choosed with next and previous options if there is a lot of varieties for that bundle',()=>{
            state.vars.varietyBundleId = -2009;
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow).mockReturnValueOnce(mockRow);
            callback(mockBundleInputs[0].bundleId);
            //expect(sayText).not.toHaveBeenCalledWith(expect.stringContaining('You do not qualify for a top up,'));
            expect(state.vars.main_menu).toEqual(`Select seed variety\n1) ${mockRow.vars.input_name}`+
            `\n2) ${mockRow.vars.input_name}`+
            `\n3) ${mockRow.vars.input_name}`+
            `\n4) ${mockRow.vars.input_name}`+
            `\n5) ${mockRow.vars.input_name}`+
            `\n6) ${mockRow.vars.input_name}`+
            `\n7) ${mockRow.vars.input_name}`+
            '\n77)Next page');
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
        
        it('should add the chosen bundle to the ordered bundle list',()=>{
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow); 
            var newList = mockBundleInputs;
            state.vars.orders = JSON.stringify(mockBundleInputs);
            newList.push(mockBundleInputs[0]);
            callback(mockBundleInputs[0].bundleId);
            expect(state.vars.orders).toEqual(JSON.stringify(newList));
        });
        it('should show the correct order price if the maize bundle is chosen',()=>{
            var maizeBundle =  mockRow.vars;
            maizeBundle.bundleName = '0.5 Maize';
            maizeBundle.price = 750;
            state.vars.orders = ' ';
            state.vars.chosenMaizeBundle = JSON.stringify(maizeBundle);
            mockCursor.hasNext.mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce(mockRow); 
            callback(maizeBundle.bundleId);
            var orderMessage = maizeBundle.bundleName + ' ' + maizeBundle.price + '\n';
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n 1) Add product\n 2) Finish ordering\n 3) Go back');
        }); 
        it('should display the final message with the bundles if the number of ordered bundles is 3',()=>{
            var firstBundles = [{'bundleId': '-2009','bundleInputId': '-1709','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'},{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'}];
            var newBundle = {'bundleId': '-8004','bundleInputId': '-8709','bundleName': 'fourth possible name bundle','price': '5251','inputName': 'fourth input'};
            var mockRow = {vars: {'bundleId': '-8004','bundleInputId': '-8709','bundle_name': 'fourth possible name bundle','price': '5251','input_name': 'fourth input'}};
            state.vars.orders = JSON.stringify(firstBundles);
            var allBundles =  [{'bundleId': '-2009','bundleInputId': '-1709','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'},{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'}, {'bundleId': '-8004','bundleInputId': '-8709','bundleName': 'fourth possible name bundle','price': '5251','inputName': 'fourth input'}];
<<<<<<< HEAD
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(false);
=======
            mockCursor.hasNext.mockReturnValueOnce(true);
>>>>>>> master
            mockCursor.next.mockReturnValueOnce(mockRow); 
            callback(newBundle.bundleId);
            var orderMessage = '';
            for( var j = 0; j < allBundles.length; j++ ){
                orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
            }
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n1) Confirm order\n 2) Go back');
        });  
<<<<<<< HEAD

        it('should display the final message with the bundles if the number of ordered bundles added to the number of past ordered bundles is 3',()=>{
            var firstBundles = [{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'}];
            var newBundle = {'bundleId': '-8004','bundleInputId': '-8709','bundleName': 'fourth possible name bundle','price': '5251','inputName': 'fourth input'};
            var mockRow = {vars: {'bundleId': '-8004','bundleInputId': '-8709','bundle_name': 'fourth possible name bundle','price': '5251','input_name': 'fourth input'}};
            state.vars.orders = JSON.stringify(firstBundles);
            var allBundles =  [{'bundleId': '-9009','bundleInputId': '-5709','bundleName': 'third possible name bundle','price': '6251','inputName': 'third input'}, {'bundleId': '-8004','bundleInputId': '-8709','bundleName': 'fourth possible name bundle','price': '5251','inputName': 'fourth input'}];
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);
            // first mock return is for getting budnles from the bundles table, and the second one is for getting the past orders for returning clients 
            mockCursor.next.mockReturnValueOnce(mockRow).mockReturnValueOnce({vars: {order: JSON.stringify([{'bundleId': '-2009','bundleInputId': '-1709','bundleName': 'Second possible name bundle','price': '2251','inputName': 'second input'}])}}); 
            callback(newBundle.bundleId);
            var orderMessage = '';
            for( var j = 0; j < allBundles.length; j++ ){
                orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
            }
            expect(sayText).toHaveBeenCalledWith(`Order placed\n ${orderMessage}`+
            ' \n1) Confirm order\n 2) Go back');
        });  
    });
    describe('order Confirmation Handler successfull callback',()=>{
        var callback;
        const mockCursor = { next: jest.fn(), 
            hasNext: jest.fn()
        };
        const mockTable = { queryRows: jest.fn(), createRow: jest.fn() };
        const mockRow = {save: jest.fn(), vars: {}};
        var orders = [{'bundleName': 'Maize','price': 1000, 'bundleId': 251, 'bundleInputId': 1},{'bundleName': 'Pesticide','price': 3000, 'bundleId': 252, 'bundleInputId': 2}];
=======
    });
    describe('order Confirmation Handler successfull callback',()=>{
        var callback;
        const mockTable = { queryRows: jest.fn(), createRow: jest.fn() };
        const mockRow = {save: jest.fn()};
        var orders = [{'bundleName': 'Maize','price': 1000},{'bundleName': 'Pesticide','price': 3000}];
>>>>>>> master
        var ordersMessage = orders[0].bundleName + ' ' + orders[0].price + ' '+orders[1].bundleName + ' ' + orders[1].price+' ';
        beforeAll(()=>{
            state.vars.orders = JSON.stringify(orders);
            state.vars.chosenMaizeBundle = ' ';
        });
        beforeEach(() => {
            mockTable.queryRows.mockReturnValue(mockCursor);
            mockTable.createRow.mockReturnValueOnce(mockRow);
            project.initDataTableById.mockReturnValue(mockTable);        
            justInTime.registerHandlers();
            callback = orderConfirmationHandler.getHandler.mock.calls[0][0];   
        });

        it('should send a message confirming the order is complete if the order is saved in roster',()=>{
            httpClient.request.mockReturnValue({status: 201});
            contact.phone_number = phoneNumber;
<<<<<<< HEAD
            mockCursor.hasNext.mockReturnValueOnce(false);
=======
            mockTable.createRow.mockReturnValueOnce(mockRow);
            project.initDataTableById.mockReturnValue(mockTable);
>>>>>>> master
            var message = `Thank you for topping-up through JiT. Your order is ${ordersMessage}`+
            ' Reach out to CE through *689# if this  order is not correct';
            callback();
            expect(sayText).toHaveBeenCalledWith(message);
            expect(project.sendMessage).toHaveBeenCalledWith({content: message, to_number: phoneNumber});
        });
        it('should update the stored order by adding newly selected bundles',()=>{
            httpClient.request.mockReturnValue({status: 201});
            contact.phone_number = phoneNumber;
            var pastOrder = [{bundleId: 250, bundleQuantity: 1, inputChoices: [1]}];
            mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true);
            mockCursor.next.mockReturnValueOnce({vars: {order: JSON.stringify(pastOrder)}, save: jest.fn()}).mockReturnValueOnce(mockRow);
            callback();
            expect(mockRow.vars.order).toEqual('[{"bundleId":250,"bundleQuantity":1,"inputChoices":[1]},{"bundleId":251,"bundleQuantity":1,"inputChoices":[1]},{"bundleId":252,"bundleQuantity":1,"inputChoices":[2]}]');
            expect(mockRow.save).toHaveBeenCalled();
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
        it('should show the correct order price if the maize bundle is chosen',()=>{
            var maizeBundle =  mockBundleInput[0];
            maizeBundle.bundleName = '0.5 Maize';
            maizeBundle.price = 750;
            state.vars.chosenMaizeBundle = JSON.stringify(maizeBundle);
            callback();
            var orderMessage = maizeBundle.bundleName + ' ' + maizeBundle.price + '\n';
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

describe('on order more', () => {
    var callback;
    var orders = [];
    var maizeOrder,secondOrder;
    orders.push(mockBundleInput[0]);
    maizeOrder = JSON.parse(JSON.stringify(mockBundleInputs[0]));
    maizeOrder.bundleName = '0.5 Maize Acre';
    maizeOrder.price = 4950;
    maizeOrder.quantity = 0.5;
    orders.push(maizeOrder);
    secondOrder = JSON.parse(JSON.stringify(mockBundleInputs[0]));
    secondOrder.bundleName = '0.25 Maize Acre';
    secondOrder.price = 2830;
    secondOrder.quantity = 0.25;
    orders.push(secondOrder);
    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
    const mockTable = { queryRows: jest.fn() };
    state.vars.orders =  ' ';
    state.vars.jitLang ='en-ke';
    beforeAll(()=>{
        jest.resetAllMocks();
        state.vars.jitLang = jitLang;
        state.vars.topUpClient = JSON.stringify(client);
        mockTable.queryRows.mockReturnValue(mockCursor);
        project.initDataTableById.mockReturnValue(mockTable);
    });
    beforeEach(() => {
        justInTime.registerHandlers();
        callback = orderMoreHandler.getHandler.mock.calls[0][0];
    });

    it('should display the bundles excluding the ones that the user has already ordered', () => {
    // mocking the get ll bundles
        mockCursor.hasNext.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false);
        mockCursor.next.mockReturnValueOnce(mockRows[0]).mockReturnValueOnce(mockRows[1]).mockReturnValueOnce(mockRows[2]);

        // mocking the get maize bundles
        mockCursor.hasNext.mockReturnValueOnce(false);
        // mockCursor.next.mockReturnValueOnce(mockRows[2]);

        mockCursor.hasNext.mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce({vars: {order: JSON.stringify([mockRows[0].vars])}});
        callback();
        expect(sayText).toHaveBeenCalledWith(`Select a product\n1) ${mockRows[1].vars.bundle_name}`+
    ` ${mockRows[1].vars.price}`+
    `\n2) ${mockRows[2].vars.bundle_name}`+
    ` ${mockRows[2].vars.price}`+
    '\n');
        expect(promptDigits).toHaveBeenCalledWith(bundleChoiceHandler.handlerName);
        expect(state.vars.bundles).toEqual( '[{"bundleId":"-9009","bundleInputId":"-5709","bundleName":"third possible name bundle","price":"6251","inputName":"third input"},{"bundleId":"-1009","bundleInputId":"-8709","bundleName":"fourth possible name bundle","price":"5251","inputName":"fourth input"}]');
    });
});