/*
admin alert module
relies on 'admin_emails' table in Telerivet
defaults to 'default' which will send to ZV
*/

var slack = require('../../slack-logger/index');

module.exports = function(content, title, name){
    slack.log(content);
    title = title || 'Telerivet Error';
    content = content || 'no email content supplied';
    name = name || 'default';
    try{
        var cursor = project.getOrCreateDataTable('admin_emails').queryRows({'vars': {'name': name}}); // access admin email tables
        if(cursor.hasNext()){
            var admin_email = cursor.next().vars.email; // check for name in table
            sendEmail(admin_email, title, content); // sends email
        }
        else{
            throw 'ADMIN ALERT FAILED: No user ' + name + ' in admin database'; // throws errror if user can't be found
        }
    }
    catch(error){
        slack.log(error.toString());
    }
};
