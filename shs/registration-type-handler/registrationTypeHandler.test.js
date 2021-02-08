var registrationTypeHandler = require ('./registrationTypeHandler');
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
var replacementHandler = require('../replacement-handler/replacementHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var getCode = require('../helper-functions/getCode');

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


describe('registrationTypeHandler test', () => {
    var registrationType = registrationTypeHandler.getHandler();
    it('should call notifyELK ', () => {
        registrationType();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should prompt for the serial number if the user choose 1',()=>{
        registrationType(1);
        expect(sayText).toHaveBeenCalledWith('Enter SHS Serial Number');
        expect(promptDigits).toHaveBeenCalledWith(serialNumberHandler.handlerName);
    });
    it('should prompt with the same menu if the user choose an invalid option',()=>{
        registrationType(4);
        expect(sayText).toHaveBeenCalledWith('Enter SHS Serial Number\n1) New SHS Unit\n2) Replacement');
        expect(promptDigits).toHaveBeenCalledWith(registrationTypeHandler.handlerName);
    });
    it('should prompt for serial number to replace if the user is registered to multiple units',()=>{
        getCode.mockReturnValueOnce(serialNumbers);
        registrationType(2);
        expect(sayText).toHaveBeenCalledWith(`Choose the device you want to replace\n 1) ${serialNumbers[0].serialNumber}`+
        `\n2) ${serialNumbers[1].serialNumber}\n`);
        expect(promptDigits).toHaveBeenCalledWith(replacementHandler.handlerName);
    });
    it('should display a message saying the client is not eligible if the message is returned from the endpoint ',()=>{
        getCode.mockReturnValueOnce('wrong serial');
        registrationType(2);
        expect(sayText).toHaveBeenCalledWith('You are not eligible to receive a code. Please place an order or call OAF  for help');
        expect(stopRules).toHaveBeenCalled();
    });
    it('should call stop rules if null is returned from the endpoint ',()=>{
        getCode.mockReturnValueOnce(null);
        registrationType(2);
        expect(sayText).not.toHaveBeenCalled();
        expect(stopRules).toHaveBeenCalled();
    });

});