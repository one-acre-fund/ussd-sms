/*
recurring traffic alert for telerivet
*/
global.main = function(){
    try{
        cursor = project.queryMessages({message_type: "ussd_session", sort_dir: "desc"});
        cursor.limit(1);
        var Row = cursor.next();
        var now = moment().format('X');
        dif_min = (now - Row.time_updated)/60;
        console.log("Last message reveived in " + dif_min +" minutes");
        if (dif_min > 10){
            var subject = "ALERT: No traffic on USSD service the last 10 min";
            var body = "No traffic on USSD service the last 10 min please check https://telerivet.com/p/8799a79f/messages for more information";
            var admin_alert = require('./lib/admin-alert');
            var alertees = ['default', 'norbert', 'tom', 'robben', 'africas_talking', 'scott', 'benjamin', 'paula']; //add alertees here. alertees must be in the 'admin_email' table in TR
            for(var i = 0; i < alertees.length; i++){
                admin_alert(body, subject, alertees[i]);
            }
            var Logger = require('../logger/elk/elk-logger');
            var log = new Logger();
            log.error('No USSD Traffic', {tags: ['USSDFailureFor10Min'],data: {FailureFOR: dif_min}});
        }
        require('../message/message-failures/queryMessageFailure');
    }
    catch(e){
        var Logger = require('../logger/elk/elk-logger');
            var log = new Logger();
            log.error('No USSD Traffic', {tags: ['USSDFailureFor10MinException'],data: {foundExceptionDetails: e}});
    }
};
