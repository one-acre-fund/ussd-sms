var eligibilityReasonHandler = require('./eligibilityReasonHandler');

module.exports = function registerInputHandlers(lang) {
    global.addInputHandler(eligibilityReasonHandler.handlerName, eligibilityReasonHandler.getHandler(lang));
};
