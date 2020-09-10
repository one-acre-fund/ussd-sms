const mainMenuInputHandler = require('./mainMenuInputHandler');

describe('main menu input handler', () => {
    it('should reprompt for choosing a service once the user chooses a wrong option', () => {
        var mainMenuHandler = mainMenuInputHandler.getHandler('en-ke');
        var main_menu = 'choose service\n1) Register client';
        state.vars.main_menu = main_menu;
        mainMenuHandler('A');
        expect(sayText).toHaveBeenCalledWith(main_menu);
        expect(promptDigits).toHaveBeenCalledWith(mainMenuInputHandler.handlerName, {'maxDigits': 2, 'submitOnHash': false});
    });
});