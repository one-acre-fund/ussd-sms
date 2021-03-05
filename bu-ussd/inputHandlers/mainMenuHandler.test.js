const {handlerName: mainMenuHandlerName, getHandler: getMainMenuHandler} = require('./mainMenuHandler');
const {start: startRegistration} = require('../registration/registration');

jest.mock('../registration/registration');

describe('main menu input handler', () => {
    beforeEach(() => {
        state.vars.main_screens = '{"1":"Select a Service\\n1) Register New Client\\n2) Place Order\\n"}';
        state.vars.main_option_values = '{"1":"registration","2":"place_order"}';
        state.vars.current_main_screen = '1';
    });
    it('should reprompt if the input is not supported', () => {
        const handler = getMainMenuHandler('en-bu');
        handler('0000');
        expect(sayText).toHaveBeenCalledWith('Select a Service\n' +
        '1) Register New Client\n' +
        '2) Place Order\n');
        expect(promptDigits).toHaveBeenCalledWith(mainMenuHandlerName);
    });
    it('should start registration if user chooses option 1 for register', () => {
        const handler = getMainMenuHandler('en-bu');
        handler('1');
        expect(startRegistration).toHaveBeenCalledWith('en-bu');
    });
    it('should not start registration if user chooses option 2 before it is implemented', () => {
        const handler = getMainMenuHandler('en-bu');
        handler('2');
        expect(startRegistration).not.toHaveBeenCalledWith('en-bu');
    });
});