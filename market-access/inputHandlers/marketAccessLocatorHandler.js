var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

var handlerName = 'mkt_access_lkt_handler';
module.exports  = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input) {
            var lang = state.vars.marketLang;
            var sectorHandler = require('./sectorHandler');
            var microEntrepreneurTable = project.initDataTableById(service.vars.micro_entrepreneur);
            var cursor = microEntrepreneurTable.queryRows({vars: {
                'district': input,
            }});
            var districts = [];
            while(cursor.hasNext()){
                var row = cursor.next();
                districts.push(row.vars);
            }
            if(districts.length > 0) {
                // save the districts details to  the state variable
                state.vars.mkt_access_entrepreneurs = JSON.stringify(districts);
                // prompt for sector
                state.vars.mkt_access_district = input;
                global.sayText(translate('enter_sector', {}, lang));
                global.promptDigits(sectorHandler.handlerName);
            } else {
                // reprompt for district
                global.sayText(translate('market_access_locator', {}, lang));
                global.promptDigits(handlerName);
            }

        };
    }
};