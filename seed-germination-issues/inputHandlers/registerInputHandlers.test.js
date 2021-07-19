const registerInputHandlers = require('./registerInputHandlers');

describe.each(['en-ke', 'sw'])('register input handlers using lang (%s)', (lang) => {
    it('should register the customSeedVarietyInputHandler', () => {
        const customSeedVarietyInputHandler = require('./customSeedVarietyInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(customSeedVarietyInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(customSeedVarietyInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(addInputHandler).toHaveBeenCalledWith(customSeedVarietyInputHandler.handlerName, handler);
    });

    it('should register the dukaInputHandler', () => {
        const dukaInputHandler = require('./dukaInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(dukaInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(dukaInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(addInputHandler).toHaveBeenCalledWith(dukaInputHandler.handlerName, handler);
    });

    it('should register the lotCodeInputHandler', () => {
        const lotCodeInputHandler = require('./lotCodeInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(lotCodeInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(lotCodeInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(addInputHandler).toHaveBeenCalledWith(lotCodeInputHandler.handlerName, handler);
    });

    it('should register the monthInputHandler', () => {
        const monthInputHandler = require('./monthInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(monthInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(monthInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(addInputHandler).toHaveBeenCalledWith(monthInputHandler.handlerName, handler);
    });

    it('should register the phoneNumberInputHandler', () => {
        const phoneNumberInputHandler = require('./phoneNumberInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(phoneNumberInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang, 'seed_germination_issues_table');
        expect(phoneNumberInputHandler.getHandler).toHaveBeenCalledWith(lang, 'seed_germination_issues_table');
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, handler);
    });

    it('should register the weekInputHandler', () => {
        const weekInputHandler = require('./plantingDateInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(weekInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(weekInputHandler.getHandler).toHaveBeenCalledWith(lang);
        expect(addInputHandler).toHaveBeenCalledWith(weekInputHandler.handlerName, handler);
    });
});
