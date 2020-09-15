var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'pshops_locator_sector_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, agrodealers_address_table) {
        return function(input) {
            var sectorsList = JSON.parse(state.vars.sectors_list);
            var choice = input.toString().trim();
            var sector = sectorsList[choice];
            var screens = JSON.parse(state.vars.sectors_screens);
            if(sector) {
                var getMessage = translator(translations, lang);
                var dealersTable = project.getOrCreateDataTable(agrodealers_address_table);
                var cursor = dealersTable.queryRows({
                    vars: {
                        sector: sector,
                        district: state.vars.selected_district
                    }
                });
                if(cursor.hasNext()) {
                    var row = cursor.next();
                    var messageToFarmer = getMessage('sms_to_farmer', {
                        '$agrodealer_name': row.vars.name,
                        '$cell': row.vars.cell,
                        '$credit_days': row.vars.credit_days,
                        '$officer_phone': row.vars.officer_phone
                    }, lang);

                    var messageToOfficer = getMessage('sms_to_officer', {'$client_phone': contact.phone_number}, lang);
                    sayText(messageToFarmer);
                    project.sendMulti({message_type: 'text', messages: [{content: messageToFarmer, to_number: row.vars.officer_phone},
                        {content: messageToOfficer, to_number: contact.phone_number}]});
                }
            } else if(input.toString().trim() == 77 && screens[state.vars.current_sectors_screen + 1]) {
                var nextScreen = state.vars.current_sectors_screen + 1;
                state.vars.current_sectors_screen = nextScreen;
                sayText(screens[nextScreen]);
                promptDigits(handlerName);
            } else {
                sayText(screens[state.vars.current_sectors_screen]);
                promptDigits(handlerName);
            }
        };
    }
};
