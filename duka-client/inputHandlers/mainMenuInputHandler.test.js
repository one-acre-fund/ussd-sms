const mainMenuInputHandler = require('./mainMenuInputHandler');
const registration = require('../registration/registration');

describe('main menu input handler', () => {
    it('should reprompt for choosing a service once the user chooses a wrong option', () => {
        const mainMenuHandler = mainMenuInputHandler.getHandler('en-ke');
        mainMenuHandler('A');
        expect(sayText).toHaveBeenCalledWith('1) Register Client');
        expect(promptDigits).toHaveBeenCalledWith(mainMenuInputHandler.handlerName, {'maxDigits': 2, 'submitOnHash': false});
    });

    it('should start the registration once the user chooses 1', () => {
        const mainMenuHandler = mainMenuInputHandler.getHandler('en-ke');
        jest.spyOn(registration, 'start');
        mainMenuHandler(1);
        expect(registration.start).toHaveBeenCalledWith('en-ke');
    });
});