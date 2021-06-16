var Logger = require('../../logger/elk/elk-logger');
var log = new Logger();



log.error('Failed to send SMS:', { Message: 'SMSFailedError', data: {TAG: message.project_id,route: message.route_id,service: message.service_id,labels: message.label_ids,toNumber: message.to_number, error: message.error_message}});