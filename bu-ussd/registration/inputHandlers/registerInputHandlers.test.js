const registerInputHandlers = require('./registerInputHandlers');

describe('registering all input handlers', () => {
    it('should register the national id input handler', () => {
        const nationalIdInputHandler = require('./nationalIdInputHandler');
        const handlerMock = jest.fn();
        jest.spyOn(nationalIdInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en_bu');
        expect(addInputHandler).toHaveBeenCalledWith(nationalIdInputHandler.handlerName, handlerMock);
    });

    it('should register the first name input handler', () => {
        const firstNameInputHandler = require('./firstNameInputHandler');
        const handlerMock = jest.fn();
        jest.spyOn(firstNameInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en_bu');
        expect(addInputHandler).toHaveBeenCalledWith(firstNameInputHandler.handlerName, handlerMock);
    });

    it('should register the last name input handler', () => {
        const lastNameInputHandler = require('./lastNameInputHandler');
        const handlerMock = jest.fn();
        jest.spyOn(lastNameInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en_bu');
        expect(addInputHandler).toHaveBeenCalledWith(lastNameInputHandler.handlerName, handlerMock);
    });

    it('should register the phone number input handler', () => {
        const phoneNumberInputHandler = require('./phoneNumberInputHandler');
        const handlerMock = jest.fn();
        jest.spyOn(phoneNumberInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en_bu');
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, handlerMock);
    });

    it('should register the group code input handler', () => {
        const groupCodeInputHandler = require('./groupCodeInputHandler');
        const handlerMock = jest.fn();
        jest.spyOn(groupCodeInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en_bu');
        expect(addInputHandler).toHaveBeenCalledWith(groupCodeInputHandler.handlerName, handlerMock);
    });

    it('should register the confirmation input handler', () => {
        const registerConfirmationInputHandler = require('./registerConfirmationInputHandler');
        const handlerMock = jest.fn();
        jest.spyOn(registerConfirmationInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en_bu');
        expect(addInputHandler).toHaveBeenCalledWith(registerConfirmationInputHandler.handlerName, handlerMock);
    });

    it('should register the continue to ordering input handler', () => {
        const continueToOrderingInputHandler = require('./continueToOrderingHandler');
        const handlerMock = jest.fn();
        jest.spyOn(continueToOrderingInputHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        registerInputHandlers('en_bu');
        expect(addInputHandler).toHaveBeenCalledWith(continueToOrderingInputHandler.handlerName, handlerMock);
    });
});
