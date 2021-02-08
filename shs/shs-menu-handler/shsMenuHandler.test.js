var shsMenuHandler = require ('./shsMenuHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var registrationTypeHandler = require('../registration-type-handler/registrationTypeHandler');
var getCode = require('../helper-functions/getCode');
var getCodeSerialHandler = require('../get-code-serial-handler/getCodeSerialHandler');
const requestCodeHandler = require('../request-code-handler/requestCodeHandler');

jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../helper-functions/getCode');


var serialNumbers = [
    {
        'unitType': 'biolite',
        'serialNumber': '23456789',
        'keyCode': '123 456 789',
        'keyCodeType': 'activation'
    },
    {
        'unitType': 'sunking',
        'serialNumber': '23456789',
        'keyCode': '123 466 799',
        'keyCodeType': 'unlock'
    }
];

describe('shsMenuHandler test', () => {
    var shsMenu = shsMenuHandler.getHandler();
    beforeAll(()=>{
        getCode.mockReturnValue(serialNumbers);
    });
    it('should call notifyELK ', () => {
        shsMenu();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call prompt for the type of registration if the user chooses 1',()=>{
        shsMenu(1);
        expect(sayText).toHaveBeenCalledWith('Enter SHS Serial Number\n1) New SHS Unit\n2) Replacement through warranty');
        expect(promptDigits).toHaveBeenCalledWith(registrationTypeHandler.handlerName);
    });
    it('should prompt for serial number  if the user is registered to multiple units',()=>{
        getCode.mockReturnValueOnce(serialNumbers);
        shsMenu(2);
        expect(sayText).toHaveBeenCalledWith(`Request activation/Unlock  code for serial number\n 1) ${serialNumbers[0].serialNumber}(${serialNumbers[0].unitType})`+
        `\n2) ${serialNumbers[1].serialNumber}(${serialNumbers[1].unitType})\n \n99) None of the above`);
        expect(promptDigits).toHaveBeenCalledWith(requestCodeHandler.handlerName);
    });
    it('should display the no serial message if no serial is returned',()=>{
        getCode.mockReturnValueOnce(false);
        shsMenu(2);
        expect(sayText).toHaveBeenCalledWith('You are not eligible to receive a code. Please place an order or call OAF  for help');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should prompt for serial number  if the user is registered to multiple units',()=>{
        getCode.mockReturnValueOnce(serialNumbers);
        shsMenu(3);
        expect(sayText).toHaveBeenCalledWith(`View Recent activation/unlock  code for serial number\n 1) ${serialNumbers[0].serialNumber}`+
        `\n2) ${serialNumbers[1].serialNumber}\n \n99) None of the above`);
        expect(promptDigits).toHaveBeenCalledWith(getCodeSerialHandler.handlerName);
    });
    it('should display a message saying the client is not eligible if the message is returned from the endpoint ',()=>{
        getCode.mockReturnValueOnce('wrong serial');
        shsMenu(3);
        expect(sayText).toHaveBeenCalledWith('You are not eligible to receive a code. Please place an order or call OAF  for help');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should display a message saying the client is not eligible if the message is returned from the endpoint ',()=>{
        getCode.mockReturnValueOnce('wrong serial');
        shsMenu(2);
        expect(sayText).toHaveBeenCalledWith('You are not eligible to receive a code. Please place an order or call OAF  for help');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should rcall stop rules if null is returned from the endpoint ',()=>{
        getCode.mockReturnValueOnce(null);
        shsMenu(2);
        expect(sayText).not.toHaveBeenCalled();
        expect(stopRules).toHaveBeenCalled();
    });
    it('should rcall stop rules if null is returned from the endpoint ',()=>{
        getCode.mockReturnValueOnce(null);
        shsMenu(3);
        expect(sayText).not.toHaveBeenCalled();
        expect(stopRules).toHaveBeenCalled();
    });
    it('should display the main menu if the client chooses 4',()=>{
        state.vars.main_menu = '1) Payment\n2) Enroll';
        state.vars.main_menu_handler = 'main_menu_handler';
        shsMenu(4);
        expect(sayText).toHaveBeenCalledWith(state.vars.main_menu);
        expect(promptDigits).toHaveBeenCalledWith(state.vars.main_menu_handler);
    });
});