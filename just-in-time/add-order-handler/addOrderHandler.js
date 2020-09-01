var handlerName = 'add_order_handler';
//var translations = require('../translations');
//var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var bundleChoiceHandler = require('../bundle-choice-handler/bundleChoiceHandler');
//var translate =  createTranslator(translations, project.vars.lang);
//var jutInTime = require('../justInTime');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onFinalizeOrder,displayBundles){
        return function (input) {
            notifyELK();
            if(input == 1){
                //jutInTime.displayBundles();
                displayBundles(JSON.parse(state.vars.topUpClient).DistrictId);
                global.promptDigits(bundleChoiceHandler.handlerName);
            }
            else if(input == 2){
                //display finalize 
                onFinalizeOrder();

            }
        };
    }
};