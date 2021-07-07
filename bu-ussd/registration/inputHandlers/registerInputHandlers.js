var nationalIdInputHandler = require('./nationalIdInputHandler');
var firstNameInputHandler = require('./firstNameInputHandler');
var lastNameInputHandler = require('./lastNameInputHandler');
var phoneNumberInputHandler = require('./phoneNumberInputHandler');
var groupCodeInputHandler = require('./groupCodeInputHandler');
var registerConfirmationInputHandler = require('./registerConfirmationInputHandler');
var continueToOrderingInputHandler = require('./continueToOrderingHandler');

module.exports = function(language) {
    // register all registration input handlers
    global.addInputHandler(nationalIdInputHandler.handlerName, nationalIdInputHandler.getHandler(language));
    global.addInputHandler(firstNameInputHandler.handlerName, firstNameInputHandler.getHandler(language));
    global.addInputHandler(lastNameInputHandler.handlerName, lastNameInputHandler.getHandler(language));
    global.addInputHandler(phoneNumberInputHandler.handlerName, phoneNumberInputHandler.getHandler(language));
    global.addInputHandler(groupCodeInputHandler.handlerName, groupCodeInputHandler.getHandler(language));
    global.addInputHandler(registerConfirmationInputHandler.handlerName, registerConfirmationInputHandler.getHandler(language));
    global.addInputHandler(continueToOrderingInputHandler.handlerName, continueToOrderingInputHandler.getHandler(language));
};
