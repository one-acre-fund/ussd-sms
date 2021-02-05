var serialNumberHandler = require ('./serialNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var shsTypeHandler = require('../shs-type-handler/shsTypeHandler');
var registerSerialNumber = require('../helper-functions/registerSerialNumber');

jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../helper-functions/registerSerialNumber');


var serialNumbers = [
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

describe('serialNumberHandler test', () => {
    var onSerialValidated = jest.fn();
    var registrationType = serialNumberHandler.getHandler(onSerialValidated);
    beforeAll(()=>{
        state.vars.replacement = '';
        registerSerialNumber.mockReturnValue(serialNumbers);
    });
    it('should call notifyELK ', () => {
        registrationType();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should prompt for serial number type if the serial number has multiple vendors',()=>{
        registerSerialNumber.mockReturnValueOnce(serialNumbers);
        registrationType(1);
        expect(sayText).toHaveBeenCalledWith(`Choose SHS Unit Type\n 1) ${serialNumbers[0].unitType}`+
        `\n2) ${serialNumbers[1].unitType}\n`);
        expect(promptDigits).toHaveBeenCalledWith(shsTypeHandler.handlerName);
    });
    it('should call onSerialValidated if the serial number is unique',()=>{
        registerSerialNumber.mockReturnValueOnce([serialNumbers[0]]);
        registrationType(1);
        expect(sayText).toHaveBeenCalledWith('Thank you for registering your SHS Unit. You will be receiving an activation code shortly if you are eligible.');
        expect(onSerialValidated).toHaveBeenCalledWith(serialNumbers[0]);
    });
    it('should prompt with the same menu if the user enters an invalid serial number',()=>{
        registerSerialNumber.mockReturnValueOnce('wrong serial');
        registrationType();
        expect(sayText).toHaveBeenCalledWith('You have entered an invalid serial number, please try again');
        expect(promptDigits).toHaveBeenCalledWith(serialNumberHandler.handlerName);
    });
    it('should call stopRules if the returned serial number is null',()=>{
        registerSerialNumber.mockReturnValueOnce( null);
        registrationType();
        expect(stopRules).toHaveBeenCalled();
    });

});