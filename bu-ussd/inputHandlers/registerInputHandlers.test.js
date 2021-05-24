const registerInputHandlers = require('./registerInputHandlers');
const {registerInputHandlers: registerRegistrationInputHandlers} = require('../registration/registration');
const {registerInputHandlers: registerEnrollmentInputHandler} = require('../enrollment/enrollment');

jest.mock('../registration/registration');
jest.mock('../enrollment/enrollment');
jest.mock('../../notifications/elk-notification/elkNotification');

let onAccountNumberValidated;
describe('register input handlers', () => {
    beforeAll(() => {
        onAccountNumberValidated = jest.fn();
    });
    it('should register splash input handler', () => {
        const splashInputHandler = require('./splashInputHandler');
        const handlerMock = jest.fn();
        jest.spyOn(splashInputHandler, 'getHAndler').mockReturnValue(handlerMock);
        registerInputHandlers('en_bu', onAccountNumberValidated);
        expect(addInputHandler).toHaveBeenCalledWith(splashInputHandler.handlerName, handlerMock);
        expect(splashInputHandler.getHAndler).toHaveBeenCalledWith('en_bu', onAccountNumberValidated);
    });
    it('should register main menu input handler', () => {
        const mainMenuInputHandler = require('./mainMenuHandler');
        const handlerMock = jest.fn();
        jest.spyOn(mainMenuInputHandler, 'getHandler').mockReturnValue(handlerMock);
        registerInputHandlers('en_bu', onAccountNumberValidated);
        expect(addInputHandler).toHaveBeenCalledWith(mainMenuInputHandler.handlerName, handlerMock);
        expect(mainMenuInputHandler.getHandler).toHaveBeenCalledWith('en_bu');
    });
    it('should register pre-enrollment input handler', () => {
        const preEnrollmentHandler = require('./preEnrollmentHandler');
        const handlerMock = jest.fn();
        jest.spyOn(preEnrollmentHandler, 'getHandler').mockReturnValue(handlerMock);
        registerInputHandlers('en_bu', onAccountNumberValidated);
        expect(addInputHandler).toHaveBeenCalledWith(preEnrollmentHandler.handlerName, handlerMock);
        expect(preEnrollmentHandler.getHandler).toHaveBeenCalledWith('en_bu');
    });
    it('should register the registration input handlers', () => {
        registerInputHandlers('en_bu', onAccountNumberValidated);
        expect(registerRegistrationInputHandlers).toHaveBeenCalledWith('en_bu');
    });
    it('should register the enrollment input handlers', () => {
        registerInputHandlers('en_bu', onAccountNumberValidated);
        expect(registerEnrollmentInputHandler).toHaveBeenCalledWith('en_bu');
    });
});
