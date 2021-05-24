const nationalIdInputHandler = require('./nationalIdInputHandler');
const firstNameInputHandler = require('./firstNameInputHandler');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('national Id number input handler', () => {
    it('should prompt for the forst name', () => {
        const handler = nationalIdInputHandler.getHandler('en_bu');
        handler('1199774856785967');
        expect(state.vars.national_id).toEqual('1199774856785967');
        expect(sayText).toHaveBeenCalledWith('Enter first name');
        expect(promptDigits).toHaveBeenCalledWith(firstNameInputHandler.handlerName);
    });
});
