var getCodeSerialHandler = require ('./getCodeSerialHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var registrationTypeHandler = require('../registrationTypeHandler/registrationTypeHandler');

jest.mock('../../notifications/elk-notification/elkNotification');

var serialNumberDetails = [
    {
        'unitType': 'biolite',
        'unitSerialNumber': '23456789',
        'keyCode': '123 456 789',
        'keyCodeType': 'activation'
    },
    {
        'unitType': 'sunking',
        'unitSerialNumber': '23456789',
        'keyCode': '123 466 799',
        'keyCodeType': 'unlock'
    }
];

describe('getCodeSerialHandler test', () => {
    var onSerialValidated = jest.fn();
    var getCodeSerial = getCodeSerialHandler.getHandler(onSerialValidated);
    
    beforeAll(()=>{
        state.vars.serialNumberDetails = JSON.stringify(serialNumberDetails);
    });
    it('should call notifyELK ', () => {
        getCodeSerial();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should prompt for registration type if the user choose 99(other serial)',()=>{
        getCodeSerial(99);
        expect(sayText).toHaveBeenCalledWith('Enter SHS Serial Number\n1) New SHS Unit\n2) Replacement');
        expect(promptDigits).toHaveBeenCalledWith(registrationTypeHandler.handlerName);
    });
    it('should show call onSerialValidated if the user enters a valid serial option(less than the total number of serial options) ',()=>{
        getCodeSerial(1);
        expect(onSerialValidated).toHaveBeenCalledWith(serialNumberDetails[0]);
    });
    it('should re-prompt for serial number if the user choose an invalid option(greater than the available options)',()=>{
        getCodeSerial(4);
        expect(sayText).toHaveBeenCalledWith(`Request activation/Unlock  code for serial number\n 1) ${serialNumberDetails[0].unitSerialNumber}`+
        `\n2) ${serialNumberDetails[1].unitSerialNumber}`+
        '\n99) Other');
        expect(promptDigits).toHaveBeenCalledWith(getCodeSerialHandler.handlerName);
    });

});