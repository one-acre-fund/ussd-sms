
var nidVerification = require('./id-verification/index');
var transactionView = require('./list-transactions/index');
var getTransactionHistory = require('./get-transaction-history/index');
var selectionHandler = require('./selection-hander/on-select');
var createTranslator = require('../utils/translator/translator');
var translations = require('./translations');


module.exports = {
    start: function (account, country) {
        var transactionHistory;
        var page = 1;
        function onIdVerified(client) { 
            transactionHistory = getTransactionHistory(client);
            transactionView.list(transactionHistory);
            promptDigits(selectionHandler.handlerName);
        }
        function onTransactionSelected(selection){
            if(selection == '99'){
                page = page + 1;
                transactionView.list(transactionHistory, page);
                promptDigits(selectionHandler.handlerName);
            }else if(parseInt(selection,10) > transactionHistory.length){
                var translate =  createTranslator(translations, project.vars.lang);
                transactionView.list(transactionHistory, page,translate('invalid_list_selection'));                
            }else{
                transactionView.show(transactionHistory[selection - 1]);
            }
        }
        // register transaction selection hhandler
        addInputHandler(nidVerification.handlerName, nidVerification.getHandler(account, country, onIdVerified));
        addInputHandler(selectionHandler.handlerName, selectionHandler.getHandler(onTransactionSelected));
        promptDigits(nidVerification.handlerName);
    }
};