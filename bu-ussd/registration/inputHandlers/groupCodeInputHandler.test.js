const registerConfirmationInputHandler = require('./registerConfirmationInputHandler');
const groupCodeInputHandler = require('./groupCodeInputHandler');
const verifyGroup = require('../../../shared/rosterApi/verifyGroup');

jest.mock('../../../shared/rosterApi/verifyGroup');
jest.mock('../../../notifications/elk-notification/elkNotification');

describe('group code input handler', () => {
    it('should reprompt for group code upon the empty input', () => {
        const groupCodeHandler = groupCodeInputHandler.getHandler('en_bu');
        groupCodeHandler();
        expect(sayText).toHaveBeenCalledWith('This group code is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(groupCodeInputHandler.handlerName);
    });

    it('should reprompt for group code upon invalid group code with non numeric district id', () => {
        const groupCodeHandler = groupCodeInputHandler.getHandler('en_bu');
        groupCodeHandler('abcde*023*2345');
        expect(sayText).toHaveBeenCalledWith('This group code is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(groupCodeInputHandler.handlerName);
    });

    it('should reprompt for group code upon invalid group code with non numeric site id', () => {
        const groupCodeHandler = groupCodeInputHandler.getHandler('en_bu');
        groupCodeHandler('554231*abcd*2345');
        expect(sayText).toHaveBeenCalledWith('This group code is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(groupCodeInputHandler.handlerName);
    });

    it('should reprompt for group code upon invalid group code with non numeric site id', () => {
        const groupCodeHandler = groupCodeInputHandler.getHandler('en_bu');
        groupCodeHandler('01646*023*ab345');
        expect(sayText).toHaveBeenCalledWith('This group code is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(groupCodeInputHandler.handlerName);
    });

    it('should reprompt for group code if the roster validation for group fails', () => {
        verifyGroup.mockReturnValueOnce(false);
        const groupCodeHandler = groupCodeInputHandler.getHandler('en_bu');
        groupCodeHandler('0164602302345');
        expect(sayText).toHaveBeenCalledWith('This group code is invalid, please try again');
        expect(promptDigits).toHaveBeenCalledWith(groupCodeInputHandler.handlerName);
    });

    it('should prompt for register confirmation upon valid group code', () => {
        verifyGroup.mockReturnValueOnce({});
        const groupCodeHandler = groupCodeInputHandler.getHandler('en_bu');
        groupCodeHandler('0164602302345');
        expect(sayText).toHaveBeenCalledWith('I understood Group Constitution Rules\n' +
        '1) Continue\n' +
        '2) Back');
        expect(promptDigits).toHaveBeenCalledWith(registerConfirmationInputHandler.handlerName);
    });
});
