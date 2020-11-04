const registerInputHandlers = require('./registerInputHandlers');

describe.each(['en-ke', 'sw'])('register input handlers using lang (%s)', (lang) => {
    it('should register the custom seed input handler', () => {
        const customSeedBrandInputHandler = require('./customSeedBrandInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(customSeedBrandInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(customSeedBrandInputHandler.handlerName, handler);
    });

    it('should register the customSeedVarietyInputHandler', () => {
        const customSeedVarietyInputHandler = require('./customSeedVarietyInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(customSeedVarietyInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(customSeedVarietyInputHandler.handlerName, handler);
    });

    it('should register the dukaInputHandler', () => {
        const dukaInputHandler = require('./dukaInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(dukaInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(dukaInputHandler.handlerName, handler);
    });

    it('should register the lotCodeInputHandler', () => {
        const lotCodeInputHandler = require('./lotCodeInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(lotCodeInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(lotCodeInputHandler.handlerName, handler);
    });

    it('should register the monthInputHandler', () => {
        const monthInputHandler = require('./monthInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(monthInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(monthInputHandler.handlerName, handler);
    });

    it('should register the phoneNumberInputHandler', () => {
        const phoneNumberInputHandler = require('./phoneNumberInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(phoneNumberInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, handler);
    });

    it('should register the seedBrandInputHandler', () => {
        const seedBrandInputHandler = require('./seedBrandInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(seedBrandInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(seedBrandInputHandler.handlerName, handler);
    });

    it('should register the seedVarietyInputHandler', () => {
        const seedVarietyInputHandler = require('./seedVarietyInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(seedVarietyInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(seedVarietyInputHandler.handlerName, handler);
    });

    it('should register the weekInputHandler', () => {
        const weekInputHandler = require('./weekInputHandler'); 
        const handler = jest.fn();
        jest.spyOn(weekInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(weekInputHandler.handlerName, handler);
    });
});
