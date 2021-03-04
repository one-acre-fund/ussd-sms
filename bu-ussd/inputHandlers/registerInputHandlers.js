var splashInputHandler = require('./splashInputHandler');
var mainMenuInputHandler = require('./mainMenuHandler');
var registration = require('../registration/registration');

module.exports = function registerInputHandlers(language, onAccountNumberValidated) {
    addInputHandler(splashInputHandler.handlerName, splashInputHandler.getHAndler(language, onAccountNumberValidated));
    addInputHandler(mainMenuInputHandler.handlerName, mainMenuInputHandler.getHandler(language));
    registration.registerInputHandlers(language);
};
