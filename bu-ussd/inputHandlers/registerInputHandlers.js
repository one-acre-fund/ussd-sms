var splashInputHandler = require('./splashInputHandler');

module.exports = function registerInputHandlers(language, onAccountNumberValidated) {
    addInputHandler(splashInputHandler.handlerName, splashInputHandler.getHAndler(language, onAccountNumberValidated));
};
