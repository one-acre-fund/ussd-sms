var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

module.exports = function farmerHandler(input) {
    var lang = state.vars.lang;
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var farmers = JSON.parse(state.vars.farmers);
    var farmer = farmers[input];
    var farmers_screens = JSON.parse(state.vars.farmers_screens);
    
    if(farmer) {
        state.vars.selected_farmer = JSON.stringify(farmer);
        sayText(getMessage('last_four_nid_digits', {}, lang));
        promptDigits('last_four_nid_digits', {
            timeout: 10,
            maxDigits: 4,
            submitOnHash: false
        });
    } else if(input === '*' && farmers_screens[state.vars.current_farmers_screen + 1]) {
        state.vars.current_farmers_screen = state.vars.current_farmers_screen + 1;
        sayText(farmers_screens[state.vars.current_farmers_screen]); 
        promptDigits('select_farmer', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else {
        sayText(getMessage('invalid_input', {'$Menu': farmers_screens[state.vars.current_farmers_screen]}, lang)); 
        promptDigits('select_farmer', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    }
};
