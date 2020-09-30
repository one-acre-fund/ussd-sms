const mainMenuInputHandler = require('./mainMenuInputHandler');
const registration = require('../registration/registration');

describe('main menu input handler', () => {
    it('should reprompt for choosing a service once the user chooses a wrong option', () => {
        const mainMenuHandler = mainMenuInputHandler.getHandler('en-ke');
        const main_menu = 'choose service\n1) Register client';
        state.vars.main_menu = main_menu;
        mainMenuHandler('A');
        expect(sayText).toHaveBeenCalledWith(main_menu);
        expect(promptDigits).toHaveBeenCalledWith(mainMenuInputHandler.handlerName, {'maxDigits': 2, 'submitOnHash': false});
    });

    it('should start the registration once the user chooses 1', () => {
        const mainMenuHandler = mainMenuInputHandler.getHandler('en-ke');
        jest.spyOn(registration, 'start');
        mainMenuHandler(1);
        expect(registration.start).toHaveBeenCalledWith('en-ke');
    });
});