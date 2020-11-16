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
    var accountNumberDifferentGroup = '24450523';
    const mockCursor = { next: jest.fn(), 
        hasNext: jest.fn()
    };
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
    it('should  call onAccountNumberValidated if the provided account number is validated from roster and is in a the same group than as the GL', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        rosterAPI.getClient.mockReturnValueOnce(client);
        accountNumberHandler(validAccountNumber);
        expect(onAccountNumberValidated).toHaveBeenCalled();
    });
    it('should not call onAccountNumberValidated if the provided account number is not valid from roster', () => {
        rosterAPI.getClient.mockReturnValueOnce(false);
        accountNumberHandler(1234);
        expect(onAccountNumberValidated).not.toHaveBeenCalled();
    });
    it('should not call onAccountNumberValidated if the provided account number is valid but is not in the same group as the one of GL', () => {
        rosterAPI.getClient.mockReturnValueOnce(client);
        state.vars.client_json = JSON.stringify(secondClient);
        accountNumberHandler(1234);
        expect(onAccountNumberValidated).not.toHaveBeenCalled();
    });
    it('should prompt for retry if input is not a valid acount number from roster', () => {
        rosterAPI.getClient.mockReturnValueOnce(false);
        accountNumberHandler(1234);
        expect(sayText).toHaveBeenCalledWith('Please reply with the account number of the farmer who want to top-up.');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should prompt for retry if input is not valid account number from roster but in a different group from the group leader\'s', () => {
        rosterAPI.getClient.mockReturnValueOnce(client);
        state.vars.client_json = JSON.stringify(secondClient);
        accountNumberHandler(accountNumberDifferentGroup);
        expect(sayText).toHaveBeenCalledWith('Please reply with the account number of the farmer who want to top-up.');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should not call onAccountNumberValidated if the provided account number in the same group but did not enroll in 2021, Long Rain', () => {
        client.BalanceHistory[0].SeasonName = '2020, Long Rain';
        rosterAPI.getClient.mockReturnValueOnce(client);
        state.vars.client_json = JSON.stringify(secondClient);
        accountNumberHandler(1234);
        expect(onAccountNumberValidated).not.toHaveBeenCalled();
    });
    it('should not call onAccountNumberValidated if the provided account number in the same group enrolled in 2021, Long Rain but through just in time', () => {
        client.BalanceHistory[0].SeasonName = '2021, Long Rain';
        rosterAPI.getClient.mockReturnValueOnce(client);
        state.vars.client_json = JSON.stringify(secondClient);
        mockCursor.hasNext.mockReturnValueOnce(true);
        accountNumberHandler(1234);
        expect(onAccountNumberValidated).not.toHaveBeenCalled();
    });
});