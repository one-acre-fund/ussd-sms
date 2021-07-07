var splashInputHandler = require('./splashInputHandler');
var mainMenuInputHandler = require('./mainMenuHandler');
var registration = require('../registration/registration');
var enrollment = require('../enrollment/enrollment');
var preEnrollmentHandler = require('./preEnrollmentHandler');
var groupCodeHandler = require('./groupCodeHandler');
var enrollmentCategoryHandler = require('./enrollmentCategoryHandler');

module.exports = function registerInputHandlers(language, onAccountNumberValidated) {
    addInputHandler(splashInputHandler.handlerName, splashInputHandler.getHAndler(language, onAccountNumberValidated));
    addInputHandler(mainMenuInputHandler.handlerName, mainMenuInputHandler.getHandler(language));
    addInputHandler(preEnrollmentHandler.handlerName, preEnrollmentHandler.getHandler(language));
    addInputHandler(groupCodeHandler.handlerName, groupCodeHandler.getHandler(language));
    addInputHandler(enrollmentCategoryHandler.handlerName, enrollmentCategoryHandler.getHandler(language));
    registration.registerInputHandlers(language);
    enrollment.registerInputHandlers(language);
};
