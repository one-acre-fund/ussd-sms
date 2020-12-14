var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var listTransactions = function (transactionHistory, page, errorMessage) {
    var language = (contact && contact.vars.lang) || (state && state.vars.lang) || service.vars.lang || project.vars.lang;
    var translate = createTranslator(translations, language);
    var offset = ((page || 1)-1) * 4;
    var to_show = transactionHistory.slice(offset, offset + 4);
    var prev = translate('prev_page') +'\n';
    var options_list = (errorMessage || '')+ translate('select_payment_detail_prompt')+'\n';
    options_list = options_list + prev;
    to_show.forEach(function (transaction, index) {
        var date = new Date(transaction.RepaymentDate).toISOString().split('T')[0];
        options_list = options_list + translate('payment_list_item', {
            '$option': offset + index + 1,
            '$date': date,
            '$amount': transaction.Amount
        }) + '\n';
    });
    options_list = options_list + translate('continue');
    sayText(options_list);
};


module.exports = {
    list: listTransactions,
    show: function (transaction, inputHandlerName) {
        var language = (contact && contact.vars.lang) || (state && state.vars.lang) || service.vars.lang || project.vars.lang;
        var translate = createTranslator(translations, language);
        var RepaymentDate = new Date(transaction.RepaymentDate).toISOString().split('T')[0];
        
        sayText(translate('payment_detail',{
            '$RepaymentId': transaction.RepaymentId,
            '$RepaymentDate': RepaymentDate,
            '$Season': transaction.Season,
            '$Amount': transaction.Amount,
            '$PaidFrom': transaction.PaidFrom
        }));
        if(inputHandlerName){
            global.promptDigits(inputHandlerName);
        }
    }
};