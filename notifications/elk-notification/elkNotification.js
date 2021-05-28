/* Example data

"route_id": null,
"external_id": null,
"source": "web",
"contact_id": "CT35ee313ad7c142ac",
"content": "elk-testing",
"in_progress": true,
"starred": false,
"project_id": "PJ5a6ae98f91cf5d0d",
"from_number": "5550123",
"service_id": "SV13ccdd0b4dbeacf5",
"time_created": 1595228062,
"id": "SM3f3ae255aa4e22b0",
"vars": {"menu_option1": "3"},
"track_clicks": false,
"direction": "incoming",
"to_number": "*149*46*7# ",
"scheduled_id": null,
"time_sent": null,
"label_ids": [],
"simulated": true,
"message_type": "call",
"time_updated": 1595228066,
"user_id": "UR83e946cf650af3a6",
"broadcast_id": null,
"phone_id": "PNc1c60e321bda897b",
"status": "received"
}.

-------------------------------------------------------------------------------------------------------------------

"data": {
      "content": "elk-testing",
      "from_number": "5550123",
      "event": "message_metadata",
      "starred": "0",
      "project_id": "PJ5a6ae98f91cf5d0d",
      "id": "SMf42442ea7e4f16ce",
      "in_progress": "1",
      "time_updated": "1595226236",
      "service_id": "SV13ccdd0b4dbeacf5",
      "error_message": "Error setting state.vars.first = : Unsupported data type for custom variables.",
      "user_id": "UR83e946cf650af3a6",
      "update_type": "set_variable",
      "message_type": "call",
      "upsert_id": "SMf42442ea7e4f16ce",
      "phone_id": "PNc1c60e321bda897b",
      "contact_id": "CT35ee313ad7c142ac",
      "track_clicks": "0",
      "vars": {
        "menu_option1": "7",
        "menu_option": "4"
      },
      "to_number": "*149*46*7# ",
      "direction": "incoming",
      "source": "web",
      "simulated": "1",
      "status": "unknown",
      "time_created": "1595226228",
      "contact": {
        "last_message_id": "SMf42442ea7e4f16ce",
        "vars": {
          "lastTransactionAmount": "1000",
          "client": "\"\"",
          "accountnumber": "12345678",
          "lastTransactionId": "POEPOEPE"
        },
        "name": "5550123",
        "project_id": "PJ5a6ae98f91cf5d0d",
        "id": "CT35ee313ad7c142ac",
        "conversation_status": "active",
        "time_updated": "1594879897",
        "incoming_message_count": "101",
        "last_outgoing_message_time": "1593430474",
        "phone_number": "5550123",
        "outgoing_message_count": "10",
        "last_message_time": "1595226228",
        "time_created": "1592320872",
        "last_incoming_message_time": "1595226228",
        "message_count": "111",
        "send_blocked": "0"
      },
      "variable": "menu_option"
    },

---------------------------------------------------------------------------------------------


*/
/* global message*/

//Note: Call vars with Date as suffix seems not working. just change the name 
var Log = require('../../logger/elk/elk-logger');
module.exports = function(){
    var url = 'https://elk.operations.oneacrefund.org:8080/telerivet';
    var opts = {};
    var dataJSON ={};
    dataJSON['content'] = message.content;
    dataJSON['from_number'] = message.from_number;
    dataJSON['starred'] = message.starred;
    dataJSON['project_id'] = message.project_id;
    dataJSON['id'] = message.id;
    dataJSON['in_progress'] = message.in_progress;
    dataJSON['time_updated'] = message.time_updated;
    dataJSON['service_id'] = message.service_id;
    dataJSON['user_id'] =  message.user_id;
    dataJSON['message_type'] = message.message_type;
    dataJSON['phone_id'] = message.phone_id;
    dataJSON['contact_id'] = message.contact_id;
    dataJSON['track_clicks'] = message.track_clicks;
    dataJSON['vars'] = message.vars;
    dataJSON['to_number'] = message.to_number;
    dataJSON['direction'] = message.direction;
    dataJSON['source'] = message.source;
    dataJSON['simulated'] = message.simulated;
    dataJSON['status'] = message.status;
    dataJSON['time_created'] = message.time_created;
    dataJSON['duration'] = message.duration;
    dataJSON['time_sent'] = message.time_sent;
    dataJSON['url'] = message.url;
    dataJSON['ring_time'] = message.ring_time;

    // Contact variables
    //dataJSON['contact']['last_message_id'] = contact.last_message_id;
    dataJSON['contact'] ={};
    dataJSON['contact']['vars'] = contact.vars;
    dataJSON['contact']['name'] = contact.name;
    dataJSON['contact']['project_id'] = contact.project_id;
    dataJSON['contact']['id'] = contact.id;
    dataJSON['contact']['conversation_status'] = contact.conversation_status;
    dataJSON['contact']['time_updated'] = contact.time_updated;
    dataJSON['contact']['incoming_message_count'] = contact.incoming_message_count;
    dataJSON['contact']['last_outgoing_message_time'] = contact.last_outgoing_message_time;
    dataJSON['contact']['phone_number'] =  contact.phone_number;
    dataJSON['contact']['outgoing_message_count'] = contact.outgoing_message_count;
    dataJSON['contact']['last_message_time'] = contact.last_message_time;
    dataJSON['contact']['time_created'] = contact.time_created;
    dataJSON['contact']['last_incoming_message_time'] = contact.last_incoming_message_time;
    dataJSON['contact']['message_count'] = contact.message_count;
    dataJSON['contact']['send_blocked'] = contact.send_blocked;




    opts.method = 'POST';
    opts.data = dataJSON;
    try{
        var response = httpClient.request(url,opts);
        console.log('elk response status code is ' + response.status);
        if(response.status != 200){
            var logger = new Log();
            console.log('bad response sending data to ELK');
            logger.warn('Failed to send ELK notification :',{data: response});
        } else {
            console.log('elk notification service successfully invoked');
        }
    }
    catch(e){
        var log = new Log();
        log.error('Failed to send a request on 1st attempt to notify ELK:', {data: e});
        console.log('Error sending a request on 1st attempt to notify ELK' + e);
        try{
            var newResponse = httpClient.request(url,opts);
            if(newResponse.status != 200){
                var loger = new Log();
                console.log('bad response sending data to ELK');
                loger.warn('Failed to send ELK notification :',{data: response});
            }

        }catch(e){
            global.sendEmail('sabin.sheja@oneacrefund.org', e);
            var logging = new Log();
            logging.error('Failed to send a request on the last attempt for notify ELK:', {data: e});
            console.log('Error sending a request for notify ELK' + e);
        }
    }
};