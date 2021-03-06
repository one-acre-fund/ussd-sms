const {handlerName: mainMenuHandlerName, getHandler: getMainMenuHandler} = require('./mainMenuHandler');
const {start: startRegistration} = require('../registration/registration');
const checkBalance = require('../checkBalance/checkBalance');
var enrollmentCategoryHandler = require('./enrollmentCategoryHandler');

jest.mock('../registration/registration');
jest.mock('../checkBalance/checkBalance');
jest.mock('../enrollment/enrollment');
jest.mock('../../notifications/elk-notification/elkNotification');

describe('main menu input handler', () => {
    beforeEach(() => {
        state.vars.main_screens = '{"1":"Select a Service\\n1) Register New Client\\n2) Place Order\\n3) Get Balance\\n"}';
        state.vars.main_option_values = '{"1":"registration","2":"place_order","3":"get_balance"}';
        state.vars.current_main_screen = '1';
        state.vars.client_json = JSON.stringify({FirstName: 'Tyrion', LastName: 'Lanyster'});
    });
    it('should reprompt if the input is not supported', () => {
        const handler = getMainMenuHandler('en_bu');
        handler('0000');
        expect(sayText).toHaveBeenCalledWith('Select a Service\n' +
        '1) Register New Client\n' +
        '2) Place Order\n' + 
        '3) Get Balance\n');
        expect(promptDigits).toHaveBeenCalledWith(mainMenuHandlerName);
    });
    it('should start registration if user chooses option 1 for register', () => {
        const handler = getMainMenuHandler('en_bu');
        handler('1');
        expect(startRegistration).toHaveBeenCalledWith('en_bu');
    });
    it('should start pre-enrollment if user chooses option 2', () => {
        const handler = getMainMenuHandler('en_bu');
        handler('2');
        expect(sayText).toHaveBeenCalledWith('1) Enroll Farmers in my group\n2) Enroll Farmer in a different group');
        expect(promptDigits).toHaveBeenCalledWith(enrollmentCategoryHandler.handlerName);
    });
    it('should start check balance if user chooses option 3 check balance', () => {
        const handler = getMainMenuHandler('en_bu');
        handler('3');
        expect(checkBalance).toHaveBeenCalledWith('en_bu', {FirstName: 'Tyrion', LastName: 'Lanyster'});
    });
});