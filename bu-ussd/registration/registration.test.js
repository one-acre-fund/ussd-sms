const registration = require('./registration');
const nationalIdHandler = require('./inputHandlers/nationalIdInputHandler');

describe('registration', () => {
    it('should export start function and register input handlers', () => {
        expect(registration.start).toBeInstanceOf(Function);
        expect(registration.registerInputHandlers).toBeInstanceOf(Function);
    });

    it('should prompt for national in upon start', () => {
        registration.start('en-bu');
        expect(sayText).toHaveBeenCalledWith('Enter National ID number');
        expect(promptDigits).toHaveBeenCalledWith(nationalIdHandler.handlerName);
    });
});
