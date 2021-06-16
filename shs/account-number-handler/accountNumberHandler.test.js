var accountNumberHandler = require ('./accountNumberHandler');
var rosterAPI = require('../../rw-legacy/lib/roster/api');
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler');
const {client}  = require('../../client-enrollment/test-client-data');

jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../../rw-legacy/lib/roster/api');

var notifyELK = require('../../notifications/elk-notification/elkNotification');
describe('account_number_handler test', () => {
    var accountNumber = accountNumberHandler.getHandler();
    beforeAll(()=>{
        rosterAPI.authClient = jest.fn();
        rosterAPI.getClient = jest.fn();
        rosterAPI.authClient.mockReturnValue(true);
        project.vars.current_enrollment_season_name = '2021, Long Rain';
    });
    it('should call notifyELK ', () => {
        accountNumber(24450523);
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should reprompt for an account number if the account number submitted is not authenticated',()=>{
        rosterAPI.authClient.mockReturnValueOnce(false);
        accountNumber(24450523);
        expect(sayText).toHaveBeenCalledWith('Enter Client Account Number');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberHandler.handlerName);
    });
    it('should show services and prompt for selection if the account number submitted is valid',()=>{
        rosterAPI.authClient.mockReturnValueOnce(true);
        rosterAPI.getClient.mockReturnValueOnce(client);
        state.vars.gLClient = JSON.stringify(client);
        accountNumber(client.AccountNumber);
        expect(sayText).toHaveBeenCalledWith('What do you want to do?\n1)Register New SHS Unit \n2)Get Activation/ Unlock Code\n3)View Recent Activation/Unlock Code \n4)Back');
        expect(promptDigits).toHaveBeenCalledWith(shsMenuHandler.handlerName);
    });
    it('should display a message saying the client is enrolled in a different season if the client did no enroll in the current season',()=>{
        rosterAPI.authClient.mockReturnValueOnce(true);
        rosterAPI.getClient.mockReturnValueOnce(client);
        client.BalanceHistory[0].SeasonName = '2020';
        state.vars.gLClient = JSON.stringify(client);
        accountNumber(client.AccountNumber);
        expect(sayText).toHaveBeenCalledWith('The acccount number used did not place order in the current season');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should display a message saying the client is in a different group than than the GL if the accounts are not registered in the same group',()=>{
        rosterAPI.authClient.mockReturnValueOnce(true);
        rosterAPI.getClient.mockReturnValueOnce(client);
        state.vars.gLClient = JSON.stringify(client);
        client.GroupId = 2020;
        accountNumber(client.AccountNumber);
        expect(sayText).toHaveBeenCalledWith('This Client is not in your group, you can only view SHS options for clients in your group');
        expect(stopRules).toHaveBeenCalled();
    });

});