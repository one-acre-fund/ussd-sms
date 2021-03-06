var nidVerification = require('./id-verification/idVerification');
var selectionHandler = require('./selection-hander/on-select');
var createTranslator = require('../utils/translator/translator');
var translations = require('./translations');
var backToListHandler= 'back_to_txlist_handler';
var currentSeason = {'ke': '2021, Long Rain', 'rw': '2021', 'UG': '2021'};
module.exports = {
    backToListHandlerName: backToListHandler,
    registerHandlers: function () {
        var transactionView = require('./display-transactions/displayTransactions');
        var language = (contact && contact.vars.lang) || (state && state.vars.lang) || service.vars.lang || project.vars.lang;
        var translate =  createTranslator(translations, language);
        function listTransactions() {
            var repayments = JSON.parse(state.vars.transactionHistory).filter(function(element){
                return element.Season === currentSeason[state.vars.country];
            });
            transactionView.list(repayments, state.vars.thPage);
            global.promptDigits(selectionHandler.handlerName);
        }
        function onIdVerified(client) { 
            var getTransactionHistory = require('./get-transaction-history/getTransactionHistory');
            var repayments = getTransactionHistory(client);
            state.vars.transactionHistory = JSON.stringify(repayments);
            state.vars.thPage = 1;
            listTransactions();
        }
     
        function onTransactionSelected(selection){
            var repayments = JSON.parse(state.vars.transactionHistory);
            var selectionNumber = parseInt(selection, 10);
            if(selection == '99'){
                state.vars.thPage = state.vars.thPage + 1;
                transactionView.list(repayments, state.vars.thPage);
                global.promptDigits(selectionHandler.handlerName);
            }
            else if(selection === '44'){
                if(state.vars.thPage === 1){
                    global.sayText(state.vars.main_menu);
                    global.promptDigits(state.vars.main_menu_handler);
                }else{
                    state.vars.thPage = state.vars.thPage - 1;
                    transactionView.list(repayments, state.vars.thPage);
                    global.promptDigits(selectionHandler.handlerName);
                }
            }
            else if(selectionNumber > repayments.length || isNaN(selectionNumber)){
                translate =  createTranslator(translations, language);
                transactionView.list(repayments, state.vars.thPage, translate('invalid_list_selection')); 
                global.promptDigits(selectionHandler.handlerName);               
            }
            else{
                transactionView.show(repayments[selection - 1],backToListHandler);
            }
        }
        // register transaction selection handler
        addInputHandler(nidVerification.handlerName, nidVerification.getHandler(onIdVerified));
        addInputHandler(selectionHandler.handlerName, selectionHandler.getHandler(onTransactionSelected));
        addInputHandler(backToListHandler,listTransactions);
        
    },
    start: function (account, country, main_menu, main_menu_handler) {
        var notifyELK = require('../notifications/elk-notification/elkNotification');
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.main_menu = main_menu;
        state.vars.main_menu_handler = main_menu_handler;
        var language = (contact && contact.vars.lang) || (state && state.vars.lang) || service.vars.lang || project.vars.lang;
        var translate =  createTranslator(translations, language);
        global.sayText(translate('last_4_national_id_prompt'));
        global.promptDigits(nidVerification.handlerName);
    }
};