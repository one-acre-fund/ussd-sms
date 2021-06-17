var Logger = require('../../logger/elk/elk-logger');
var log = new Logger();
try{
    log.error('Failed to send SMS:', { tags: ['SMSFailedError'], data: {projectID: global.message.project_id,routeID: global.message.route_id,serviceID: global.message.service_id,labelsTagged: global.message.label_ids,toPhoneNumber: global.message.to_number, errorMessage: global.message.error_message}});
    //global.message.resend({});
}
catch(e){
    log.error('Failed to send SMS:', { tags: ['SMSFailureException'], data: {errorFound: e}});
}