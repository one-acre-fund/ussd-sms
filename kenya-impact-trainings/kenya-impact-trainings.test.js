const impactTrainings = require('./kenya-impact-trainings');
const phoneHandler = require('./inputHandlers/phoneNumberHandler');

describe('kenya impact trainings', () => {
    it('should prompt for phone number', () => {
        impactTrainings.start('en');
        expect(sayText).toHaveBeenCalledWith('Enter your phone number');
        expect(promptDigits).toHaveBeenCalledWith(phoneHandler.handlerName);
    });

    it('should register phone input handler', () => {
        const trainingMenuText = jest.fn();
        const handlerMock = jest.fn();
        jest.spyOn(phoneHandler, 'getHandler').mockReturnValueOnce(handlerMock);
        impactTrainings.registerInputHandlers(trainingMenuText, 'en');
        expect(addInputHandler).toHaveBeenCalledWith(phoneHandler.handlerName, handlerMock);
        expect(phoneHandler.getHandler).toHaveBeenCalledWith(trainingMenuText, 'en');
    });

    it('should export start function and register input handlers', () => {
        expect(impactTrainings.start).toBeInstanceOf(Function);
        expect(impactTrainings.registerInputHandlers).toBeInstanceOf(Function);
    });
});