const firstNameInputHandler = require('./firstNameInputHandler');
const lastNameInputHandler = require('./lastNameInputHandler');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('first name input handler', () => {
    it('should prompt for last name input handler', () => {
        var handler = firstNameInputHandler.getHandler('en_bu');
        handler('bahati');
        expect(state.vars.first_name).toEqual('bahati');
        expect(sayText).toHaveBeenCalledWith('Enter last name');
        expect(promptDigits).toHaveBeenCalledWith(lastNameInputHandler.handlerName);
    });
});
