var accountNumberInputHandler = require('./accountNumberInputHandler');
var mainMenuHandler = require('./mainMenuHandler');
var nextScreenBalanceHandler = require('../checkBalance/inputHandlers/nextScreenBalance');
var buybackTransactions =  require('../../buyback-transactions/buyBackTransactions');

module.exports = function registerInputHandlers(lang) {
    global.addInputHandler(accountNumberInputHandler.handlerName, accountNumberInputHandler.getHandler(lang));
    global.addInputHandler(mainMenuHandler.handlerName, mainMenuHandler.getHandler(lang));
    global.addInputHandler(nextScreenBalanceHandler.handlerName, nextScreenBalanceHandler.getHandler(lang));
    buybackTransactions.registerInputHandlers();
};
