var shsTypeHandler = require ('./shsTypeHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var registerSerialNumber = require('../helper-functions/registerSerialNumber');
var Log = require('../../logger/elk/elk-logger');

jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../helper-functions/registerSerialNumber');
jest.mock('../../logger/elk/elk-logger');


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

describe('shsTypeHandler test', () => {
    var onSerialValidated = jest.fn();
    var shsType = shsTypeHandler.getHandler(onSerialValidated);
    var mockLogger;
    beforeAll(()=>{
        state.vars.replacement = '';
        registerSerialNumber.mockReturnValue(serialNumbers);
        state.vars.serialNumbers = JSON.stringify(serialNumbers);
        mockLogger ={ error: jest.fn() };
        Log.mockReturnValue(mockLogger);
    });
    it('should call notifyELK ', () => {
        shsType();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onSerialValidated if the input is valid and only one serial number is returned',()=>{
        registerSerialNumber.mockReturnValueOnce([serialNumbers[0]]);
        shsType(1);
        expect(sayText).toHaveBeenCalledWith('Thank you for registering your SHS Unit. You will be receiving an activation code shortly if you are eligible.');
        expect(onSerialValidated).toHaveBeenCalledWith(serialNumbers[0]);
    });
    it('should re-prompt with the same menu if the user choose an invalid option',()=>{
        shsType(4);
        expect(sayText).toHaveBeenCalledWith(`Choose SHS Unit Type\n 1) ${serialNumbers[0].unitType}`+
        `\n2) ${serialNumbers[1].unitType}\n`);
        expect(promptDigits).toHaveBeenLastCalledWith(shsTypeHandler.handlerName);
    });
    it('should display a message saying that the serial number is wrong and reprompt for a serial number if the endpoint doesn\'t recognize it',()=>{
        registerSerialNumber.mockReturnValueOnce('wrong serial');
        shsType(1);
        expect(sayText).toHaveBeenCalledWith('You have entered an invalid serial number, please try again');
        expect(promptDigits).toHaveBeenCalledWith(shsTypeHandler.handlerName);
    });

    it('should log an error when the endpoint returns more than one serial of the same type', () => {
        registerSerialNumber.mockReturnValueOnce(serialNumbers);
        shsType(1);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Multiple units with one unit type', 
            {data: serialNumbers}
        );        
    });
    it('should call registerSerialNumber with the replacement if the client choose to replace',()=>{
        state.vars.replacement = JSON.stringify(serialNumbers[0]);
        registerSerialNumber.mockReturnValueOnce([serialNumbers[0]]);
        shsType(1);
        expect(registerSerialNumber).toHaveBeenLastCalledWith(serialNumbers[0].serialNumber,serialNumbers[0].unitType,serialNumbers[0]);
    });
    it('should call registerSerialNumber with no replacement if the client choose not to replace',()=>{
        state.vars.replacement = '';
        registerSerialNumber.mockReturnValueOnce([serialNumbers[0]]);
        shsType(1);
        expect(registerSerialNumber).toHaveBeenLastCalledWith(serialNumbers[0].serialNumber,serialNumbers[0].unitType);
    });

});