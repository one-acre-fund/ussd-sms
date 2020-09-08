var handlerName = 'v_confirm_handler_enr';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onBundleSelected){
        return function (input) {
            notifyELK();
            if(input == 1){
                var varietyChosen = JSON.parse(state.vars.chosenVariety);
                onBundleSelected(varietyChosen.bundleId,true,varietyChosen.bundleInputId);
            }
        };
    }
};