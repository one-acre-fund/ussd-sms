/*
config file for Rwanda Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
needs a config function to package custom variables saved as data_packer
*/

var data_packer = function(account_number, call_category, phone_number, tags){ //placeholder for now needs update when available
    return JSON.stringify({
        'ticket': {
            'account_number': account_number,
            'call_category': call_category,
            'tags': tags
        }
    });
};

module.exports = {
    'url': 'https://oneacrefund-rw.zendesk.com/api/v2',
    'data_packer': data_packer,
    'ticket_table': 'ticket_table_name', // placeholder for now - needs update
    'update_table': false,
};
