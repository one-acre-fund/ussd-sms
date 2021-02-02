var Log = require('../../logger/elk/elk-logger');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

module.exports = function (requestData){
    var fullUrl = service.vars.shs_reg_endpoint + '/api/services/shs/v1/units?accountNumber=' + requestData.accountNumber + '&countryCode='+ requestData.countryCode;
    var opts = { headers: {} };
    opts.method = 'GET';
    console.log('requetData:'+ JSON.stringify(requestData));
    console.log('url:'+fullUrl+ 'opts:'+ JSON.stringify(opts));
    try {
        var logger;
        var response = httpClient.request(fullUrl, opts);
        console.log('response:'+ JSON.stringify(response));
        if (response.status == 200) {
            var data = JSON.parse(response.content).results;
            return data;
        }
        else {
            if(response.status == 500){
                global.sayText(translate('internal_error',{},state.vars.shsLang));
                return null;
            }
            logger = new Log();
            logger.error('Failed to get shs unit', {data: response});
        }
    } catch (error) {
        logger = new Log();
        logger.error('Error getting shs unit', {data: error});
    }
    return false;
};