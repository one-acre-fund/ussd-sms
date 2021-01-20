var rosterAPI = require('../../rw-legacy/lib/roster/api');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var Log = require('../../logger/elk/elk-logger');


module.exports =  function RosterColRequest(AccNum,Amount, phone_number){
    var logger = new Log();
    rosterAPI.verbose = true;
    //rosterAPI.dataTableAttach();
    var phone = {
        country: 'KE',
        phone_number: '+' + PhoneNumber.formatInternationalRaw(phone_number, 'KE')
    };
    var provider='Beyonic';
    var colResult = rosterAPI.collectPayment(AccNum,Amount , phone, provider);
    call.vars.colreqTimeStamp = moment().format('X');
    notifyELK();
    if(!colResult.Success){
        logger.error('KE USD Collection RequestKE USD Collection Request failed',{data: colResult, tags: ['repayments']});
        return false;
    }
    return colResult.Success;
};
