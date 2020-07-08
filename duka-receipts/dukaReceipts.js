(function main() {
    if (typeof(state.vars.email) !== 'undefined') {
        // Send email to testing partner
        var EmailText = JSON.stringify(state.vars);
        sendEmail(state.vars.email, 'Testing email', EmailText);
    }
    var getObjectKeys = require('./objectKeysFilter');
    var response = state.vars;
    var netPriceKeys = getObjectKeys(response, 'netUnitPrice');
    var rowPriceKeys = getObjectKeys(response, 'rowPrice');
    var totalCost = 0;
    var productCost = 0;
    
    netPriceKeys.forEach(function(key){
        totalCost = totalCost + Number(response[key]); 
    });
    
    rowPriceKeys.forEach(function(key){
        productCost = productCost + Number(response[key]); 
    });
    var vatCost = totalCost - productCost;
    var SMStext = 'Thank you for shopping at the OAF Duka! Date: ' + response.date + ' Invoice nro: ' + response.receipt + ' Product cost: KES ' + productCost + ' VAT: KES ' + vatCost + ' Total: KES ' + totalCost;
    var RouteIDPush = project.vars.route_push;
    var Label = project.getOrCreateLabel('Duka Receipt');
    project.sendMessage({
        content: SMStext,
        to_number: contact.phone_number,
        route_id: RouteIDPush,
        label_ids: [Label.id]
    });
})();
