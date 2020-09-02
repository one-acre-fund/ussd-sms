var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var phoneHandlerName = 'mw_bb_phone';

module.exports = {
    handlerName: phoneHandlerName,
    handler: function(input) {
        var lang = state.vars.lang;
        var getMessage = translator(translations, lang);
        var phoneValid = input.match(/^(088|099)\d{7}$/);
        if(phoneValid){
            var mobile_money_phone = phoneValid[0];
            var selected_variety = JSON.parse(state.vars.selected_variety);
            var buyback_transactions_table = project.initDataTableById(service.vars.buy_back_transactions_table_id);
            var buyback_transaction_row = buyback_transactions_table.createRow({
                vars: {
                    'mobile_money_phone': mobile_money_phone,
                    'session_phone': contact.phone_number,
                    'transaction_volume': state.vars.transaction_volume,
                    'crop_type': state.vars.selected_crop,
                    'variety_type': selected_variety.variety,
                    'first_name': state.vars.first_name,
                    'last_name': state.vars.last_name,
                    'account_number': state.vars.account_number
                }
            });
            buyback_transaction_row.save();
            var message = getMessage('transaction_data_recorded', {}, lang);
            sayText(message);
            stopRules();
        } else {
            sayText(getMessage('invalid_phone', {}, lang));
            promptDigits('mw_bb_phone', {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 10
            });
        }
    }
};
