/*
config file for Tanzania Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
needs a config function to package custom variables saved as data_packer
*/

var data_packer = function(account_number, call_category, phone_number, tags){ //very basic - update as needed
    return JSON.stringify({
        'ticket': {
            'subject': call_category,
            'raw_subject': call_category,
            'status': 'new',
            'description': 'USSD request for call back\nAccount number : ' + account_number,
            'priority': 'normal',
            'custom_fields': [
                {'id': 360002486860, 'value': phone_number},
                {'id': 360002630840, 'value': 'ussd__please_call_me'}, //hardcoded for now but you can switch this up
            ],
            'tags': tags
        }
    });
};

module.exports = {
    'url': 'https://oneacrefund-tz.zendesk.com/api/v2',
    'data_packer': data_packer,
    'ticket_table': 'ticket_table_name', // placeholder for now - needs update
    'update_table': false,
};
