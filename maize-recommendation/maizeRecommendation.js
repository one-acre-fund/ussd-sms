 
module.exports = function() {

    var defaultEnvironment;
    if(service.active){
        defaultEnvironment = 'prod';
    }else{
        defaultEnvironment = 'dev';
    }

    var env;
    if(service.vars.env === 'prod' || service.vars.env === 'dev'){
        env = service.vars.env;
    }else{
        env = defaultEnvironment;
    }

    var maize_recommendation_table = project.vars[env + '_maize_recommendation_table'];

    var translations = require('./translations/index');
    var translator = require('../utils/translator/translator');
    var districtResponseHandler = require('./responseHandlers/districtResponseHandler');
    var lang = contact.vars.lang;
    var getMessage = translator(translations, lang);
    var welcome_message = getMessage('welcome_message', {}, lang);
    var promptDistrict = getMessage('district', {}, lang);

    project.sendMulti({
        messages: [
            {content: welcome_message, to_number: contact.phone_number}, 
            {content: promptDistrict, to_number: contact.phone_number}], 
        message_type: 'text'
    });
    global.waitForResponse(districtResponseHandler.handlerName);
    return {
        maize_recommendation_table: maize_recommendation_table,
        lang: lang
    };
};