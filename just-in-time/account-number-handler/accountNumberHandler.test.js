const {handlerName, getHandler} = require ('./accountNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var rosterAPI = require('../../rw-legacy/lib/roster/api');
var {client} = require('../../client-enrollment/test-client-data');
var secondClient = require('../test-client-data');
jest.mock('../../rw-legacy/lib/roster/api');
jest.mock('../../notifications/elk-notification/elkNotification');
describe('account_number_handler', () => {
    var accountNumberHandler;
    var onAccountNumberValidated;
    var validAccountNumber = '123456789';
    var inValidAccount = '22';
    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
    const mockWarehouseRow = {vars: {'warehouse': 'name'}};
    beforeAll(()=>{
        rosterAPI.authClient = jest.fn();
        rosterAPI.authClient.mockReturnValue(true);  
        const mockTable = { queryRows: jest.fn()};
        mockTable.queryRows.mockReturnValue(mockCursor);
        project.initDataTableById.mockReturnValue(mockTable);
    });
    beforeEach(() => {
        sayText.mockReset();
        onAccountNumberValidated = jest.fn();
        accountNumberHandler = getHandler(onAccountNumberValidated);
        rosterAPI.getClient = jest.fn();
        state.vars.country = 'KE';
        state.vars.jitLang = 'en-ke';
        state.vars.client_json = JSON.stringify(client);
    });
    it('should call notifyELK ', () => {
        accountNumberHandler(validAccountNumber);
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should display a message saying that the client already topped up if the client topped up with maximum 3 products',() =>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        var order = [
            {bundleId: 123, bundleName: 'Maize'},
            {bundleId: 124, bundleName: 'Rice'},
            {bundleId: 125, bundleName: 'Irish'}];
        mockCursor.next.mockReturnValueOnce({vars: {order: JSON.stringify(order)}});
        accountNumberHandler(validAccountNumber);
        expect(sayText).toHaveBeenCalledWith('Thank you! You have already topped-up with a maximum of three JiT products.');
        expect(stopRules).toHaveBeenCalled();

    });

    it('should let clients order more products if they have topped up less than 3 products',() =>{
        mockCursor.hasNext.mockReturnValueOnce(true);
        var order = [{bundleId: 123, bundleName: 'Maize'}];
        mockCursor.next.mockReturnValueOnce({vars: {order: JSON.stringify(order)}});
        accountNumberHandler(validAccountNumber);
        expect(rosterAPI.getClient).toHaveBeenCalledWith(validAccountNumber, 'KE');

    });
    it('should display a message saying that the client already enrolled through just in time if they have already enrolled',() =>{
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(true);
        accountNumberHandler(validAccountNumber);
        expect(sayText).toHaveBeenCalledWith('This farmer is registered through JIT enrollement. They cannot top up.');
        expect(stopRules).toHaveBeenCalled();

    });
    it('should  display a message saying that the client did not enroll if the account number is not valid', () => {
        mockCursor.hasNext.mockReturnValue(false);
        rosterAPI.authClient.mockReturnValueOnce(false);
        accountNumberHandler(inValidAccount);
        expect(sayText).toHaveBeenCalledWith('Farmer is not enrolled this season. Please try again.');
        expect(stopRules).toHaveBeenCalled();
    });
    
    it('should  display a message saying that the client did not enroll if the current season is different from the season received from their account', () => {
        client.BalanceHistory[0].SeasonName = '2020, Long Rain';
        rosterAPI.getClient.mockReturnValue(false);
        accountNumberHandler(validAccountNumber);
        expect(sayText).toHaveBeenCalledWith('Farmer is not enrolled this season. Please try again.');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should  display a message saying that the client did not enroll if the current season is different from the season received from their account', () => {
        client.BalanceHistory[0].SeasonName = '2020, Long Rain';
        rosterAPI.getClient.mockReturnValue(client);
        accountNumberHandler(validAccountNumber);
        expect(sayText).toHaveBeenCalledWith('Farmer is not enrolled this season. Please try again.');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should  trim the client\'s balance history if it\'s greater than 3', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        client.BalanceHistory[1] = client.BalanceHistory[0];
        client.BalanceHistory[2] =client.BalanceHistory[0];
        client.BalanceHistory[3] =client.BalanceHistory[0];
        rosterAPI.getClient.mockReturnValue(client);
        accountNumberHandler(validAccountNumber);
        expect(JSON.parse(state.vars.topUpClient).BalanceHistory.length).toEqual(3);
    });
    it('should  reprompt for an account number if the given client\'s group is different from the group leader\'s group', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        rosterAPI.getClient.mockReturnValue(client);
        state.vars.client_json = JSON.stringify(secondClient);
        accountNumberHandler(validAccountNumber);
        expect(sayText).toHaveBeenCalledWith('This farmer is not in your group. You can only top-up farmers in your group');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should  display the amount remaining if the client is valid but did not pay the minimum 500', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 200;
        var amount = 500 -200;
        rosterAPI.getClient.mockReturnValue(client);
        state.vars.client_json = JSON.stringify(client);
        accountNumberHandler(validAccountNumber);
        expect(sayText).toHaveBeenCalledWith(`You do not qualify for a top up, pay at least ${amount}`+
        ' to qualify.');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should  call  account number validated if the account number provided is valid in the same group as GL, is not enrolled and paid 500', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 500;
        rosterAPI.getClient.mockReturnValue(client);
        state.vars.client_json = JSON.stringify(client);
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockWarehouseRow);
        accountNumberHandler(validAccountNumber);
        expect(onAccountNumberValidated).toHaveBeenCalled();
        expect(state.vars.warehouse).toEqual(mockWarehouseRow.vars.warehouse);
    });
    it('should  set the variety warehouse if the client satisfied being in the group and the warehouse ', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 500;
        rosterAPI.getClient.mockReturnValue(client);
        state.vars.client_json = JSON.stringify(client);
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);
        mockCursor.next.mockReturnValueOnce(mockWarehouseRow).mockReturnValueOnce(mockWarehouseRow);
        accountNumberHandler(validAccountNumber);
        expect(state.vars.varietyWarehouse).toEqual(mockWarehouseRow.vars.warehouse);
    });
    it('should  not call  account number validated if the account number provided is valid in the same group as GL, is not enrolled and paid 500 but does not have a corresponding warehouse', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        client.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 500;
        rosterAPI.getClient.mockReturnValue(client);
        state.vars.client_json = JSON.stringify(client);
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false);
        accountNumberHandler(validAccountNumber);
        expect(onAccountNumberValidated).not.toHaveBeenCalled();
    });
    it('should  display a message saying that the client did not enroll if the account number is not valid', () => {
        mockCursor.hasNext.mockReturnValue(false);
        client.BalanceHistory.length = 0;
        rosterAPI.getClient.mockReturnValueOnce(client);
        accountNumberHandler(inValidAccount);
        expect(sayText).toHaveBeenCalledWith('Farmer is not enrolled this season. Please try again.');
        expect(stopRules).toHaveBeenCalled();
    });
});