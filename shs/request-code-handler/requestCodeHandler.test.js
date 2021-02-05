var requestCodeHandler = require ('./requestCodeHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var registerSerialNumber = require('../helper-functions/registerSerialNumber');
var shsTypeHandler = require('../shs-type-handler/shsTypeHandler');

jest.mock('../../notifications/elk-notification/elkNotification');

jest.mock('../helper-functions/registerSerialNumber');


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

describe('request code handler test', () => {
    var onSerialValidated = jest.fn();
    var requestCode = requestCodeHandler.getHandler(onSerialValidated);
    beforeAll(()=>{
        state.vars.serialNumberDetails = JSON.stringify(serialNumbers);
    });
    it('should call notifyELK ', () => {
        requestCode();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onSerialValidated for a new serial number to register',()=>{
        registerSerialNumber.mockReturnValue([serialNumbers[1]]);
        requestCode(1);
        expect(onSerialValidated).toHaveBeenCalledWith(serialNumbers[1]);
        
    });
    it('should prompt for the serial number type  if the serial is registered to multiple vendors',()=>{
        registerSerialNumber.mockReturnValue(serialNumbers);
        requestCode(2);
        expect(sayText).toHaveBeenCalledWith(`Choose SHS Unit Type\n 1) ${serialNumbers[0].unitType}`+
        `\n2) ${serialNumbers[1].unitType}\n`);
        expect(promptDigits).toHaveBeenCalledWith(shsTypeHandler.handlerName);
    });
    it('should re-prompt with the same menu if the user choose an invalid option',()=>{
        requestCode(4);
        expect(sayText).toHaveBeenCalledWith(`Request activation/Unlock  code for serial number\n 1) ${serialNumbers[0].serialNumber}`+
        `\n2) ${serialNumbers[1].serialNumber}\n`);
        expect(promptDigits).toHaveBeenLastCalledWith(requestCodeHandler.handlerName);
    });
});