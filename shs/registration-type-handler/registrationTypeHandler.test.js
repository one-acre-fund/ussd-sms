var registrationTypeHandler = require ('./registrationTypeHandler');
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');


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

});