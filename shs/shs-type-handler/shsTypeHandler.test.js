var shsTypeHandler = require ('./shsTypeHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var registerSerialNumber = require('../register-serial-Number/registerSerialNumber');

jest.mock('../../notifications/elk-notification/elkNotification');
jest.mock('../register-serial-Number/registerSerialNumber');


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

describe('shsTypeHandler test', () => {
    var onSerialValidated = jest.fn();
    var shsType = shsTypeHandler.getHandler(onSerialValidated);
    beforeAll(()=>{
        registerSerialNumber.mockReturnValue(serialNumbers);
        state.vars.serialNumbers = JSON.stringify(serialNumbers);
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

});