/*
lib module for retrieving by outgoing messages by language
lang options now are en, ki, sw - can be generalized
function takes a message 'name', and return the message translation in the corresponding lang
opts should include any additions or changes to the message string - for example, inserting client credit, etc - in order of insertion
opts should be an object - the keys can be any string that can be converted to a regex, and the values will be the replacement strings.
ensure that keys are unique
*/
var translations = require('./message-translations');

module.exports = function(msg_name, opts, lang){ //todo: settings and translation tables should be generalized once this is online
    var newline_regex = RegExp('~B','g');
    var msg_lang = lang || 'en'; // default language
    opts = opts || {}; //default value for opts
    var output = '';
    var message = translations[msg_name];
    if(message){
        output = message[msg_lang].replace(newline_regex, '\n');
        var keys = Object.keys(opts);
        if(keys.length > 0){ //insert options
            for(var i = 0; i < keys.length; i++){
                var k = keys[i];
                output = output.replace(k, opts[k]); //output replace
            }
        }
        return output;
    } else{
        throw 'Message ' + msg_name + ' | ' + msg_lang + ' not found';
    }  
};
