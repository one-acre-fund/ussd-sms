var translations = require('./translations/index');
var translator = require('../utils/translator/translator');

var districtsInputHandler = require('./inputHandlers.js/districtInputHandler');
var sectorsInputHandler = require('./inputHandlers.js/sectorInputHandler');
var getSectors = require('./getSectors');


function displayDistricts(lang) {
    var getMessage = translator(translations, lang);
    var districts = {
        '1': 'Gakenke',
        '2': 'Kayonza',
        '3': 'Rwamagana',
        '4': 'My District is not listed'
    };
    var message = '';
    Object.keys(districts).map(function(label) {
        message = message + getMessage('list', {'$label': label, '$option': districts[label]}, lang);
    });
    var menu = getMessage('districts_title', {'$Menu': message}, lang);
    sayText(menu);
}


module.exports = {
    registerInputHandlers: function(lang, agrodealers_address_table) {
        addInputHandler(districtsInputHandler.handlerName, districtsInputHandler.getHandler(lang, displayDistricts, getSectors, agrodealers_address_table));
        addInputHandler(sectorsInputHandler.handlerName, sectorsInputHandler.getHandler(lang, agrodealers_address_table));
    },
    start: function(lang) {
        displayDistricts(lang);
        promptDigits(districtsInputHandler.handlerName);
    }
};
