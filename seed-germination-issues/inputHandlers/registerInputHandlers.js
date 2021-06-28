var customSeedVarietyInputHandler = require('./customSeedVarietyInputHandler');
var dukaInputHandler = require('./dukaInputHandler');
var lotCodeInputHandler = require('./lotCodeInputHandler');
var monthInputHandler = require('./monthInputHandler');
var phoneNumberInputHandler = require('./phoneNumberInputHandler');
var plantingDateInputHandler = require('./plantingDateInputHandler');

module.exports = function(lang, seed_germination_issues_table) {
    global.addInputHandler(customSeedVarietyInputHandler.handlerName, customSeedVarietyInputHandler.getHandler(lang));
    global.addInputHandler(dukaInputHandler.handlerName, dukaInputHandler.getHandler(lang));
    global.addInputHandler(lotCodeInputHandler.handlerName, lotCodeInputHandler.getHandler(lang));
    global.addInputHandler(monthInputHandler.handlerName, monthInputHandler.getHandler(lang));
    global.addInputHandler(phoneNumberInputHandler.handlerName, phoneNumberInputHandler.getHandler(lang, seed_germination_issues_table));
    global.addInputHandler(plantingDateInputHandler.handlerName, plantingDateInputHandler.getHandler(lang));
};
