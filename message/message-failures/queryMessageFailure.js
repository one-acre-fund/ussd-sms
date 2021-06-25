var logService = project.initServiceById(project.vars.logErrorServiceId);
var cursor = project.queryMessages({
    status: 'failed' && 'not_delivered',
    starred: false
});
cursor.limit(100);
while (cursor.hasNext()) {
    var message = cursor.next();
    logService.invoke({
        context: 'message', 
        message_id: message.id
    });
    message.starred = true;
    message.save();
}
console.log('Failed Messages :'+cursor.count());