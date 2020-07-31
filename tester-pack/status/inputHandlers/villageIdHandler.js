var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

module.exports = function villageIdHandler(input) {
    var lang = state.vars.lang || 'en';

    var getMesssage = translator(translations, lang);
    var farmers_table = project.initDataTableById('DTe1025290143442b5');
    state.vars.village_id = input;
    var farmers_rows = farmers_table.queryRows({
        vars: {'village_id': input}
    });

    var confirmed = [];
    var registered = [];
    while(farmers_rows.hasNext()) {
        var row = farmers_rows.next();

        if(row.vars.received_tester_pack === true) {
            var confirmed =  {
                firstName: row.vars.first_name,
                lastName: row.vars.last_name
            }
            confirmed.push(confirmed);
        }

        var registered =  {
            firstName: row.vars.first_name,
            lastName: row.vars.last_name
        }

        registered.push(registered);
    }
    
    sayText(getMesssage('registered_confirmed', {'registered': registered.length, '$confirmed': confirmed.length}));
    promptDigits('registered_confirmed', {
        maxDigits: 1,
        submitOnHash: false,
        timeout: 5
    })
    state.vars.farmers = JSON.stringify({registered: registered, confirmed: confirmed});
}