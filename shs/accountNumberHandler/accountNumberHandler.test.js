var accountNumberHandler = require ('./accountNumberHandler');
var rosterAPI = require('../../rw-legacy/lib/roster/api');
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler');

jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../../rw-legacy/lib/roster/api');

var notifyELK = require('../../notifications/elk-notification/elkNotification');
describe('account_number_handler test', () => {
    var accountNumber = accountNumberHandler.getHandler();
    beforeAll(()=>{
        rosterAPI.authClient = jest.fn();
        rosterAPI.authClient.mockReturnValue(true);
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
        accountNumber(24450523);
        expect(sayText).toHaveBeenCalledWith('What do you want to do?\n1)Register New SHS Unit \n2)Get Activation/ Unlock Code\n3)View Recent Activation/Unlock Code \n4)Back');
        expect(promptDigits).toHaveBeenCalledWith(shsMenuHandler.handlerName);
    });

});