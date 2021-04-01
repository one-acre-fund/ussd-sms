var gLMenuHandler = require ('./gLMenuHandler');
var accountNumberHandler = require('../account-number-handler/accountNumberHandler'); 
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');


describe('gLMenu_handler test', () => {
    var gLMenu = gLMenuHandler.getHandler();
    it('should call notifyELK ', () => {
        gLMenu();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should show services and prompt for selection if the user choose 1',()=>{
        gLMenu(1);
        expect(sayText).toHaveBeenCalledWith('What do you want to do?\n1)Register New SHS Unit \n2)Get Activation/ Unlock Code\n3)View Recent Activation/Unlock Code \n4)Back');
        expect(promptDigits).toHaveBeenCalledWith(shsMenuHandler.handlerName);
    });
    it('should prompt for the client account number if the user choose 2',()=>{
        gLMenu(2);
        expect(sayText).toHaveBeenCalledWith('Enter Client Account Number');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberHandler.handlerName);
    });
    it('should prompt with the same menu if the user choose an invalid option',()=>{
        gLMenu(4);
        expect(sayText).toHaveBeenCalledWith('Select a Service\n1) My SHS Unit\n2)SHS Unit for another Client\n3) Back');
        expect(promptDigits).toHaveBeenCalledWith(gLMenuHandler.handlerName);
    });

});