var Log = require('../../logger/elk/elk-logger');
module.exports = function(extraData){
    var url = 'https://elk.operations.oneacrefund.org:8080/telerivet';
    var opts = {};
    opts.method = 'POST';
    var elkTable = project.initDataTableById('DT91bc8f35ae1bda3f');
    extraData['id'] = message.id;
    extraData['message_type'] = message.message_type;
    extraData['from_number'] = message.from_number;
    extraData['project_id'] = message.project_id;
    extraData['service_id'] = message.service_id;
    extraData['to_number'] = message.to_number;
    opts.data = extraData;
    
    var response = httpClient.request(url,opts);
    if(response.status != 200){
        var logger = new Log();
        console.log('bad response sending data to ELK');
        logger.warn('Failed to send ELK notification :',{data: response});
    } else{
        var new_elk_row = elkTable.createRow({
            vars: {
                'NewjsonData': JSON.stringify(opts.data),
                'response': JSON.stringify(response)
            }
        });
        new_elk_row.save();
    }
    //console.log('////////////////'+JSON.stringify(opts));
};