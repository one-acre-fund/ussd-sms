var translations = require('./translations/index');
var translator = require('../utils/translator/translator');


module.exports = function(district, agrodealers_address_table, lang) {
    var getMessage = translator(translations, lang);
    var table = project.getOrCreateDataTable(agrodealers_address_table);
    var cursor = table.queryRows({vars: {'district': district}});
    
    var sectors = {};
    
    var sectorIndex = 0;
    while(cursor.hasNext()) {
        var row = cursor.next();
        sectorIndex = sectorIndex + 1;
        sectors[sectorIndex] = row.vars.sector;
    }

    var message = getMessage('sectors_title', {'$district': district}, lang);
    var nextOption = getMessage('next', {}, lang);
    var screen = 1;
    var screens = {};
    Object.keys(sectors).forEach(function(label, index, arr){
        var line = getMessage('list', {'$label': label, '$option': sectors[label]}, lang);
        if((message + line + nextOption).length < 140) {
            message = message + line;
        }else if((message + line + nextOption).length >= 140) {
            screens[screen] = message + nextOption;
            screen = screen + 1;
            message = line;
        }
        if(!arr[index + 1]) {
            screens[screen] = message;
        }
    });

    return {screens: screens, list: sectors};
};
