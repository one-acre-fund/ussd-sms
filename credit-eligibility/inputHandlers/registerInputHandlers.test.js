const eligibilityReasonHandler = require('./eligibilityReasonHandler');
const registerInputHandlers = require('./registerInputHandler');

jest.mock('./eligibilityReasonHandler');

describe('register input handlers', () => {
    it('should register the eligibility reason handler', () => {
        var handler = jest.fn();
        jest.spyOn(eligibilityReasonHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers('en');
        expect(addInputHandler).toHaveBeenCalledWith(eligibilityReasonHandler.handlerName, handler);
        expect(eligibilityReasonHandler.getHandler).toHaveBeenCalledWith('en');
    });
});
