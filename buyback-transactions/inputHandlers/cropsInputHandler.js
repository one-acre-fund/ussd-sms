var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function(input) {
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    var crops = JSON.parse(state.vars.crops);
    var crop = crops[input.replace(/\D/g, '')];
    
    if(crop) {
        state.vars.selected_crop = crop;
        if(crop == 'Rice'){
            var varieties = {'1': 'Singapusa', '2': 'Tambala', '3': 'Amanda', '4': 'Kilombelo'};
            state.vars.varieties = JSON.stringify(varieties);
            var varietiesMenu = crop + ' Varieties\n';
            Object.keys(varieties).forEach(function(variety){
                varietiesMenu += getMessage('varieties', {'$label': variety, '$variety': varieties[variety]});
            });
            state.vars.varieties_menu = varietiesMenu;
            sayText(varietiesMenu);
            promptDigits('varieties', {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 1
            });
        } else {
            sayText(getMessage('kgs', {}, lang));
            promptDigits('kgs', {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 1
            });
        }
    } else {
        var cropsMenu = getMessage('crops', {}, lang);
        sayText(getMessage('invalid_input_try_again', {'$Menu': cropsMenu}, lang));
        promptDigits('crops', {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    }
};