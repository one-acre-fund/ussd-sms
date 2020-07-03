var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function contactDukaAgentHandler(input) {
    var duka_options = JSON.parse(state.vars.duka_options);
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);

    if(input == duka_options.reach_out_to_agent) {
        var selected_duka = JSON.parse(state.vars.selected_duka);
        var duka_supervisor_pn = selected_duka.duka_supervisor_pn;
        var duka_supervisor_name = selected_duka.duka_supervisor_name;

        var message_to_supervisor = getMessage('message_to_duka_supervisor' , {'$client_pn': contact.phone_number}, lang);
        var message_to_farmer = getMessage('message_to_farmer' , {'$duka_supervisor_name': duka_supervisor_name, '$duka_supervisor_pn': duka_supervisor_pn}, lang);
        sendMessage(contact.phone_number, message_to_farmer);
        sendMessage(duka_supervisor_pn, message_to_supervisor);
    } else if(input == duka_options.exit_menu) {
        stopRules();
    }
};
