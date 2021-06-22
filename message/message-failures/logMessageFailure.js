var Logger = require('../../logger/elk/elk-logger');
var log = new Logger();
try{
    log.error('Message Failure:', { tags: ['MessageFailedError'], data: {projectID: global.message.project_id,routeID: global.message.route_id,serviceID: global.message.service_id,labelsTagged: global.message.label_ids,toPhoneNumber: global.message.to_number, errorMessage: global.message.error_message, messageStatus: global.message.status, messageDirection: global.message.direction}});
}
catch(e){
    log.error('Message Failure:', { tags: ['MessageFailureException'], data: {errorFound: e}});
}