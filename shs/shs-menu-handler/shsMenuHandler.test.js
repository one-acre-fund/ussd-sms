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
        expect(sayText).toHaveBeenCalledWith('Enter SHS Serial Number\n1) New SHS Unit\n2) Replacement');
        expect(promptDigits).toHaveBeenCalledWith(registrationTypeHandler.handlerName);
    });
    it('should prompt for serial number  if the user is registered to multiple units',()=>{
        getCode.mockReturnValueOnce(serialNumbers);
        shsMenu(2);
        expect(sayText).toHaveBeenCalledWith(`Request activation/Unlock  code for serial number\n 1) ${serialNumbers[0].serialNumber}`+
        `\n2) ${serialNumbers[1].serialNumber}\n`);
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
        `\n2) ${serialNumbers[1].serialNumber}\n`);
        expect(promptDigits).toHaveBeenCalledWith(getCodeSerialHandler.handlerName);
    });
});