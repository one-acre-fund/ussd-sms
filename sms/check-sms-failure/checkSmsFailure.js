//var Logger = require('../../logger/elk/elk-logger');

var cursor = project.queryMessages({
    direction: 'outgoing', 
    message_type: 'sms',
    status: 'failed'
});
//var log = new Logger();
var service = project.initServiceById('SV2ffce571ee2be4e7');
while (cursor.hasNext()) {
    var message = cursor.next();
    service.invoke({
        context: "message", 
        message_id: message.id
    });
    //log.error('Failed to send SMS:', { Message: 'SMSFailedError', data: {TAG: message.project_id,route: message.route_id,service: message.service_id,labels: message.label_ids,toNumber: message.to_number}});
    //message.resend({
    //route_id: message.route_id
    //});
}
console.log(cursor.count());

/*var notDeliveredCursor = project.queryMessages({
    direction: 'outgoing', 
    message_type: 'sms',
    status: 'not_delivered'
});

while (notDeliveredCursor.hasNext()) {
    message = cursor.next();
    //log.warn('Failed to Deliver SMS:', { Message: 'SMSDeliveryError', data: {TAG: message.project_id,route: message.route_id,service: message.service_id,labels: message.label_ids,toNumber: message.to_number}});
    message.resend({
        route_id: message.route_id
    });
    
}
console.log(notDeliveredCursor.count());
*/