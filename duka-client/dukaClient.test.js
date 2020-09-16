const dukaClient = require('./dukaClient');
const mainMenuInputHandler = require('./inputHandlers/mainMenuInputHandler');

describe.each(['en-ke', 'sw'])('duka client entry using (%s)', (lang) => {
    it('start the application', () => {
        dukaClient.start(lang);
        const splashScreen = {'sw': 'Chagua huduma\n1) Kusajili Mteja',
            'en-ke': 'Select service\n1) Register Client'};
        expect(sayText).toHaveBeenCalledWith(splashScreen[lang]);
        expect(promptDigits).toHaveBeenCalledWith(mainMenuInputHandler.handlerName);
    });

    it('should register all input handlers', () => {
        const mainMenuHandler = jest.fn();
        jest.spyOn(mainMenuInputHandler, 'getHandler').mockReturnValue(mainMenuHandler);
        dukaClient.registerInputHandlers(lang);
        expect(addInputHandler).toHaveBeenCalledWith(mainMenuInputHandler.handlerName, mainMenuHandler);
    });
});
