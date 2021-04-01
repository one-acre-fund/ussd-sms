var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var makePhones = require('../utils/makePhones');
var handlerName = 'kenya_training_input_handler';
module.exports = {
    handlerName: handlerName,
    /**
     * input handler for the kenya trainings menu
     * @param {Function} trainingMenuText function to display screen for the trainings menu
     */
    getHandler: function(trainingMenuText, lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var trainingsHandler = state.vars.trainingsHandler; 
            var clients_table = project.getOrCreateDataTable('impact trainings clients');
            var phoneNumber = input.trim();

            var allPhones = makePhones(phoneNumber);
            var foundPhones = allPhones.some(function(phone) {
                var cursor = clients_table.queryRows({
                    vars: {
                        phone_number: phone
                    }
                });
                var phoneFound = cursor.hasNext();
                if(phoneFound) {
                    var row = cursor.next();
                    contact.name = row.vars.name; // save the contact name for later use in triggering the trainings
                }
                return !!phoneFound;
            });
            if(foundPhones){
                // row found
                trainingMenuText();
                global.promptDigits(trainingsHandler);
            } else {
                // no phone found
                global.sayText(getMessage('enter_phone', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
