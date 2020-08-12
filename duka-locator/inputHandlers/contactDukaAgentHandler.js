var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = function contactDukaAgentHandler(input) {
    notifyELK();
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
        project.sendMulti({
            messages: [
                {content: message_to_farmer, to_number: contact.phone_number}, 
                {content: message_to_supervisor, to_number: duka_supervisor_pn}], 
            message_type: 'text'
        });
    } else if(input == duka_options.exit_menu) {
        stopRules();
    }
};
