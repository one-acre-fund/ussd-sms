const {handlerName: mainMenuHandlerName, getHandler: getMainMenuHandler} = require('./mainMenuHandler');
const {start: startRegistration} = require('../registration/registration');
const checkBalance = require('../checkBalance/checkBalance');

jest.mock('../registration/registration');
jest.mock('../checkBalance/checkBalance');

describe('main menu input handler', () => {
    beforeEach(() => {
        state.vars.main_screens = '{"1":"Select a Service\\n1) Register New Client\\n2) Place Order\\n3) Get Balance\\n"}';
        state.vars.main_option_values = '{"1":"registration","2":"place_order","3":"get_balance"}';
        state.vars.current_main_screen = '1';
        state.vars.client_json = JSON.stringify({FirstName: 'Tyrion', LastName: 'Lanyster'});
    });
    it('should reprompt if the input is not supported', () => {
        const handler = getMainMenuHandler('en-bu');
        handler('0000');
        expect(sayText).toHaveBeenCalledWith('Select a Service\n' +
        '1) Register New Client\n' +
        '2) Place Order\n' + 
        '3) Get Balance\n');
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
    it('should start check balance if user chooses option 3 check balance', () => {
        const handler = getMainMenuHandler('en-bu');
        handler('3');
        expect(checkBalance).toHaveBeenCalledWith('en-bu', {FirstName: 'Tyrion', LastName: 'Lanyster'});
    });
});