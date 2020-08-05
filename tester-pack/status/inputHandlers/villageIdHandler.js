var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

module.exports = function villageIdHandler(input) {
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    var farmers_table = project.initDataTableById(service.vars.ExtensionFarmers);
    state.vars.village_id = input;
    var farmers_rows = farmers_table.queryRows({
        vars: {'village_id': input}
    });

    var confirmed = {};
    var registered = {};
    var clabel = 1;
    var rlabel = 1;
    if(!farmers_rows.hasNext()) {
        // if no village with the id matching the input
        var villageIdPromtMessage = getMessage('village_id', {}, lang);
        sayText(getMessage('incorrect_village_id', {'$Menu': villageIdPromtMessage}, lang));
        promptDigits('village_id', {
            maxDigits: 10,
            submitOnHash: false,
            timeout: 5
        });
    } else {
        while(farmers_rows.hasNext()) {
            var row = farmers_rows.next();

            if(row.vars.received_tester_pack === true) {
                var confirmedFarmer =  {
                    first_name: row.vars.first_name,
                    last_name: row.vars.last_name
                };
                confirmed[clabel] = confirmedFarmer;
                clabel = clabel + 1;
            }

            var registeredFarmer =  {
                first_name: row.vars.first_name,
                last_name: row.vars.last_name
            };

            registered[rlabel] = registeredFarmer;
            rlabel = rlabel + 1;
        }
        state.vars.farmers = JSON.stringify({registered: registered, confirmed: confirmed});
        sayText(getMessage('registered_confirmed', {'$registered': Object.keys(registered).length, '$confirmed': Object.keys(confirmed).length}));
        promptDigits('registered_confirmed', {
            maxDigits: 1,
            submitOnHash: false,
            timeout: 5
        });
    }
};