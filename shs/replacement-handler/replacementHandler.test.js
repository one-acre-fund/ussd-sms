var replacementHandler = require ('./replacementHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
jest.mock('../../notifications/elk-notification/elkNotification');


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

describe('replacement handler test', () => {
    var replacement = replacementHandler.getHandler();
    beforeAll(()=>{
        state.vars.serialNumberDetails = JSON.stringify(serialNumbers);
    });
    it('should call notifyELK ', () => {
        replacement();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should prompt for a new serial number to register',()=>{
        replacement(1);
        expect(sayText).toHaveBeenCalledWith('Enter SHS Serial Number');
        expect(promptDigits).toHaveBeenCalledWith(serialNumberHandler.handlerName);
    });
    it('should re-prompt with the same menu if the user choose an invalid option',()=>{
        replacement(4);
        expect(sayText).toHaveBeenCalledWith(`Choose the device you want to replace\n 1) ${serialNumbers[0].serialNumber}`+
        `\n2) ${serialNumbers[1].serialNumber}\n`);
        expect(promptDigits).toHaveBeenLastCalledWith(replacementHandler.handlerName);
    });
    

});