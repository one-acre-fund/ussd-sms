var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'second_name_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSecondNameReceived){
        return function (input) {
            onSecondNameReceived(input);
        };
    }
};