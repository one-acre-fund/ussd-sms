var service = project.initServiceById('SV2ffce571ee2be4e7');
var cursor = project.queryMessages({
    direction: 'outgoing', 
    message_type: 'sms',
    status: 'failed'
});
while (cursor.hasNext()) {
    var message = cursor.next();
    service.invoke({
        context: 'message', 
        message_id: message.id
    });
}
console.log('Failed:'+ cursor.count());
var notDeliveredCursor = project.queryMessages({
    direction: 'outgoing', 
    message_type: 'sms',
    status: 'not_delivered'
});
while (notDeliveredCursor.hasNext()) {
    message = notDeliveredCursor.next();
    service.invoke({
        context: 'message', 
        message_id: message.id
    });
}
console.log('Not Delivered:' + notDeliveredCursor.count());