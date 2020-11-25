var handlerName = 'variety_confirmation_handler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var bundleChoiceHandler = require('../bundle-choice-handler/bundleChoiceHandler');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onBundleSelected,displayBundles){
        return function (input) {
            notifyELK();
            if(input == 1){
                var varietyChosen = JSON.parse(state.vars.chosenVariety);
                onBundleSelected(varietyChosen.bundleId,true,varietyChosen.bundleInputId);
            }
            else{
                displayBundles(JSON.parse(state.vars.topUpClient).DistrictId);
                global.promptDigits(bundleChoiceHandler.handlerName);
            }
        };
    }
};