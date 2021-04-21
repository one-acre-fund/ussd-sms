var splashInputHandler = require('./splashInputHandler');
var mainMenuInputHandler = require('./mainMenuHandler');
var registration = require('../registration/registration');
var enrollment = require('../enrollment/enrollment');
var preEnrollmentHandler = require('./preEnrollmentHandler');

module.exports = function registerInputHandlers(language, onAccountNumberValidated) {
    addInputHandler(splashInputHandler.handlerName, splashInputHandler.getHAndler(language, onAccountNumberValidated));
    addInputHandler(mainMenuInputHandler.handlerName, mainMenuInputHandler.getHandler(language));
    addInputHandler(preEnrollmentHandler.handlerName, preEnrollmentHandler.getHandler(language));
    registration.registerInputHandlers(language);
    enrollment.registerInputHandlers(language);
};
