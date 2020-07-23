var nidVerification = require('./id-verification/idVerification');
var transactionView = require('./display-transactions/displayTransactions');
var getTransactionHistory = require('./get-transaction-history/getTransactionHistory');
var selectionHandler = require('./selection-hander/on-select');
var createTranslator = require('../utils/translator/translator');
var translations = require('./translations');

var backToListHandler= 'back_to_txlist_handler';

module.exports = {
    backToListHandlerName: backToListHandler,
    registerHandlers: function () {
        var language = (contact && contact.vars.lang) || (state && state.vars.lang) || service.vars.lang || project.vars.lang;
        var translate =  createTranslator(translations, language);
        function listTransactions() {
            var repayments = JSON.parse(state.vars.transactionHistory);
            transactionView.list(repayments, state.vars.thPage);
            global.promptDigits(selectionHandler.handlerName);
        }
        function onIdVerified(client) { 
            var repayments = getTransactionHistory(client);
            state.vars.transactionHistory = JSON.stringify(repayments);
            state.vars.thPage = 1;
            listTransactions();
        }
     
        function onTransactionSelected(selection){
            var repayments = JSON.parse(state.vars.transactionHistory);
            if(selection == '99'){
                state.vars.thPage = state.vars.thPage + 1;
                transactionView.list(repayments, state.vars.thPage);
                global.promptDigits(selectionHandler.handlerName);
            }else if(parseInt(selection,10) > repayments.length){
                translate =  createTranslator(translations, language);
                transactionView.list(repayments, state.vars.thPage, translate('invalid_list_selection')); 
                global.promptDigits(selectionHandler.handlerName);               
            }else{
                transactionView.show(repayments[selection - 1],backToListHandler);
            }
        }
        // register transaction selection handler
        addInputHandler(nidVerification.handlerName, nidVerification.getHandler(onIdVerified));
        addInputHandler(selectionHandler.handlerName, selectionHandler.getHandler(onTransactionSelected));
        addInputHandler(backToListHandler,listTransactions);
        
    },
    start: function (account, country) {
        state.vars.account = account;
        state.vars.country = country;
        var language = (contact && contact.vars.lang) || (state && state.vars.lang) || service.vars.lang || project.vars.lang;
        var translate =  createTranslator(translations, language);
        global.sayText(translate('last_4_national_id_prompt'));
        global.promptDigits(nidVerification.handlerName);
    }
};