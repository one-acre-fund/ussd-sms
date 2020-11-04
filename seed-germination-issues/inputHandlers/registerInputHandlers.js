var customSeedBrandInputHandler = require('./customSeedBrandInputHandler');
var customSeedVarietyInputHandler = require('./customSeedVarietyInputHandler');
var dukaInputHandler = require('./dukaInputHandler');
var lotCodeInputHandler = require('./lotCodeInputHandler');
var monthInputHandler = require('./monthInputHandler');
var phoneNumberInputHandler = require('./phoneNumberInputHandler');
var seedBrandInputHandler = require('./seedBrandInputHandler');
var seedVarietyInputHandler = require('./seedVarietyInputHandler');
var weekInputHandler = require('./weekInputHandler');

module.exports = function(lang) {
    global.addInputHandler(customSeedBrandInputHandler.handlerName, customSeedBrandInputHandler.getHandler(lang));
    global.addInputHandler(customSeedVarietyInputHandler.handlerName, customSeedVarietyInputHandler.getHandler(lang));
    global.addInputHandler(dukaInputHandler.handlerName, dukaInputHandler.getHandler(lang));
    global.addInputHandler(lotCodeInputHandler.handlerName, lotCodeInputHandler.getHandler(lang));
    global.addInputHandler(monthInputHandler.handlerName, monthInputHandler.getHandler(lang));
    global.addInputHandler(phoneNumberInputHandler.handlerName, phoneNumberInputHandler.getHandler(lang));
    global.addInputHandler(seedBrandInputHandler.handlerName, seedBrandInputHandler.getHandler(lang));
    global.addInputHandler(seedVarietyInputHandler.handlerName, seedVarietyInputHandler.getHandler(lang));
    global.addInputHandler(weekInputHandler.handlerName, weekInputHandler.getHandler(lang));
};
