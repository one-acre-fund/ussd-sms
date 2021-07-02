const lastNameInputHandler = require('./lastNameInputHandler');
const phoneNumberInputHandler = require('./phoneNumberInputHandler');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe('last name input handler', ()=> {
    it('should prompt for the last name input handler', () => {
        const handler = lastNameInputHandler.getHandler('en_bu');
        handler('robben');
        expect(state.vars.last_name).toEqual('robben');
        expect(sayText).toHaveBeenCalledWith('Enter Client\'s phone number or 0 if they don\'t have one');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });
});