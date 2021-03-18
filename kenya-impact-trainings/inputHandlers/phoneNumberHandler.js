var makePhones = require('../utils/makePhones');
var handlerName = 'kenya_training_input_handler';
module.exports = {
    handlerName: handlerName,
    /**
     * input handler for the kenya trainings menu
     * @param {String} trainingMenuText screen for the trainings menu
     */
    getHandler: function(trainingMenuText) {
        return function(input) {
            var trainingsHandler = state.vars.trainingsHandler; 
            var mainMenu = state.vars.trainingsHandler;
            var mainMenuHandlerName = state.vars.trainingsHandler; 
            var clients_table = project.getOrCreateDataTable('impact trainings clients');
            var phoneNumber = input.trim();

            var allPhones = makePhones(phoneNumber);
            var foundPhones = allPhones.some(function(phone) {
                var row = clients_table.queryRows({
                    vars: {
                        phone_number: phone
                    }
                });
                return !!row.hasNext();
            });
            var usedPhone = foundPhones[0];
            if(usedPhone) {
                // row found
                trainingMenuText();
                global.promptDigits(trainingsHandler);
            } else {
                // no phone found
                global.sayText(mainMenu);
                global.promptDigits(mainMenuHandlerName);
            }
        };
    }
};
