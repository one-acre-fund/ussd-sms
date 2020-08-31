var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var kgsHandler = require('./kgsInputHandler');
var varietiesHandler = require('./varietiesInputHandler');

var cropsHandlerName = 'crops';

function getVarietiesByCrop(crop, table) {
    var varietiesTable = project.initDataTableById(table);
    var varieties_cursor = varietiesTable.queryRows({
        'vars': {
            'crop': crop
        }
    });
    console.log('cursor: ' + JSON.stringify(varieties_cursor));
    var varieties = {};
    var label = 1;
    while(varieties_cursor.hasNext()){
        //loop through crop varieties
        console.log('reaching');
        var row = varieties_cursor.next();
        varieties[label] = {variety: row.vars.variety, price: row.vars.price_per_kg};
        label = label + 1;
    }
    return varieties;
}

module.exports = {
    handlerName: cropsHandlerName,
    Handler: function(input) {
        var lang = state.vars.lang;
        var getMessage = translator(translations, lang);
        var crops = JSON.parse(state.vars.crops);
        var crop = crops[input.replace(/\D/g, '')];
    
        if(crop) {
            state.vars.selected_crop = crop;
            // get the varieties by crop
            var varieties = getVarietiesByCrop(crop, service.vars.varieties_table_id);
            if(Object.keys(varieties).length > 1){
                state.vars.varieties = JSON.stringify(varieties);
                var varietiesMenu = crop + ' Varieties\n';
                Object.keys(varieties).forEach(function(record){
                    varietiesMenu += getMessage('varieties', {'$label': record, '$variety': varieties[record].variety});
                });
                state.vars.varieties_menu = varietiesMenu;
                sayText(varietiesMenu);
                promptDigits(varietiesHandler.handlerName, {
                    submitOnHash: false,
                    timeout: 5,
                    maxDigits: 1
                });
            } else {
                sayText(getMessage('kgs', {}, lang));
                promptDigits(kgsHandler.handlerName, {
                    submitOnHash: false,
                    timeout: 5,
                    maxDigits: 1
                });
            }
        } else {
            var cropsMenu = getMessage('crops', {}, lang);
            sayText(getMessage('invalid_input_try_again', {'$Menu': cropsMenu}, lang));
            promptDigits(cropsHandlerName, {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 1
            });
        }
    }
};