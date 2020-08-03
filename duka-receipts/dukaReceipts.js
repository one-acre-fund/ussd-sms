(function main() {
    if (typeof(state.vars.email) !== 'undefined') {
        // Send email to testing partner
        var EmailText = JSON.stringify(state.vars);
        sendEmail(state.vars.email, 'Testing email', EmailText);
    }
    var getObjectKeys = require('./objectKeysFilter');
    var response = state.vars;
    var rowPriceKeys = getObjectKeys(response, /^rowPrice?/);
    var netRowPriceKeys = getObjectKeys(response, /^netRowPrice?/);
    var totalCost = 0;
    var productCost = 0;
    
    rowPriceKeys.forEach(function(key){
        totalCost = totalCost + Number(response[key]);
    });
    
    netRowPriceKeys.forEach(function(key){
        productCost = productCost + Number(response[key]); 
    });

    var total_cost = response.amount || totalCost;
    var rounded_total_cost =  Math.round(total_cost).toFixed(2);
    
    var vatCost = total_cost - productCost;
    var SMStext = 'Thank you for shopping at the OAF Duka! Date: ' + response.date + ' Invoice nro: ' + response.receipt + ' Product cost: KES ' + productCost + ' VAT: KES ' + vatCost.toFixed(2) + ' Total: KES ' + rounded_total_cost;
    var RouteIDPush = project.vars.route_push;
    var Label = project.getOrCreateLabel('Duka Receipt');
    console.log('sent message' + SMStext);
    project.sendMessage({
        content: SMStext,
        to_number: contact.phone_number,
        route_id: RouteIDPush,
        label_ids: [Label.id]
    });
})();
