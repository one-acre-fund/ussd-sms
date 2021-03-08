const onAccountNumberValidated = require('../../utils/onAccountNumberValidated');
const registerClient = require('../../../shared/rosterApi/registerClient');
const getPhoneNumber = require('../../../shared/rosterApi/getPhoneNumber');
const continueToOrderingHandler = require('./continueToOrderingHandler');
const registerConfirmationInputHandler = require('./registerConfirmationInputHandler');

jest.mock('../../utils/onAccountNumberValidated');
jest.mock('../../../shared/rosterApi/registerClient');
jest.mock('../../../shared/rosterApi/getPhoneNumber');
const groupInfo = {
    districtId: 1,
    siteId: 2,
    groupId: 3,
};
describe('register confirmation', () => {
    beforeEach(() => {
        state.vars.first_name = 'Tyrion';
        state.vars.last_name = 'Lanyster';
        state.vars.national_id = '1199728364743789723';
        state.vars.phone_number = '0788667349';
        contact.phone_number = '078836475822';
    });
    it('should reprompt for confirmation upon empty input', () => {
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en-bu');
        registerConfirmationHandler();
        expect(sayText).toHaveBeenCalledWith('I understood Group Constitution Rules\n' +
        '1) Continue\n' +
        '2) Back');
        expect(promptDigits).toHaveBeenCalledWith(registerConfirmationInputHandler.handlerName);
    });

    it('should reprompt for confirmation upon non numerical input', () => {
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en-bu');
        registerConfirmationHandler(' ashkjdhf ');
        expect(sayText).toHaveBeenCalledWith('I understood Group Constitution Rules\n' +
        '1) Continue\n' +
        '2) Back');
        expect(promptDigits).toHaveBeenCalledWith(registerConfirmationInputHandler.handlerName);
    });

    it('should end the session once the user is already registered', () => {
        state.vars.group_info = JSON.stringify(groupInfo);
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '78363748'});
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en-bu');
        registerConfirmationHandler('1');
        expect(sayText).toHaveBeenCalledWith('you are already registered. your account number is 78363748');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should prompt for ordering once the registration is successfull', () => {
        state.vars.group_info = JSON.stringify(groupInfo);
        state.vars.duplicated_user = false;
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en-bu');
        registerClient.mockReturnValueOnce({AccountNumber: '78363748'});
        getPhoneNumber.mockReturnValueOnce([{IsInactive: false, PhoneNumber: '0780378599'}]);
        registerConfirmationHandler('1');
        expect(sayText).toHaveBeenCalledWith('Thank you for registering , your account number is 78363748, press 1 to continue or 0 to exit');
        expect(promptDigits).toHaveBeenCalledWith(continueToOrderingHandler.handlerName);
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': [
            {'content': 'Thank you for registering , your account number is 78363748',
                'to_number': '078836475822'},
            {'content': 'Thank you for registering , your account number is 78363748', 
                'to_number': '0780378599'}]});
    });

    it('should notify the user if there is an error during registration', () => {
        state.vars.group_info = JSON.stringify(groupInfo);
        state.vars.duplicated_user = false;
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en-bu');
        registerClient.mockImplementationOnce(() => {});
        registerConfirmationHandler('1');
        expect(sayText).toHaveBeenCalledWith('There was an error please try again/later');
        expect(stopRules).toHaveBeenCalled();
    });
    
});