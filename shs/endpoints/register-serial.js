// Returns 201 for successful registration and body:{[{activationCode: '000-000',type: 'type'},{activationCode: '000-000',type: 'other-type'}]}
var Log = require('../../logger/elk/elk-logger');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

module.exports = function (requestData){

    var fullUrl = service.vars.shs_reg_endpoint + '/api/services/shs/v1/units/register';
    var opts = { headers: {} };
    opts.method = 'POST';
    opts.data = requestData;
    console.log('requestsData:'+ JSON.stringify(requestData));
    console.log('url:'+fullUrl+ 'opts:'+ JSON.stringify(opts));
    try {
        var logger;
        var response = httpClient.request(fullUrl, opts);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!11'+JSON.parse(response.content).message);
        if (response.status == 201 || response.status == 200) {
            var data = JSON.parse(response.content).results;
            console.log('success:'+ JSON.stringify(data));
            return data;
        }
        else if(JSON.parse(response.content).message == 'Unit with serial number '+requestData.unitSerialNumber+' assigned to another client'){
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22');
            global.sayText(translate('serial_assigned',{'$serialType': requestData.unitSerialNumber},state.vars.shsLang));
            return null;
        }
        else if(JSON.parse(response.content).message == 'No unit found with serial number '+ requestData.unitSerialNumber){
            return 'wrong serial';
        }
        else {
            if(response.status == 500)
                global.sayText(translate('internal_error',{},state.vars.shsLang));
            console.log('Failed to register shs unit' +JSON.stringify(response));
            logger = new Log();
            logger.error('Failed to register shs unit', {data: response});
            return null;
        }
    } catch (error) {
        console.log('Error registering shs unit' +error);
        logger = new Log();
        logger.error('Error registering shs unit', {data: error});
        
    }
    console.log(JSON.stringify(response));
    return null;
};