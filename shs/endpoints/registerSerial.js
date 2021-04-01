// Returns 201 for successful registration and body:{[{activationCode: '000-000',type: 'type'},{activationCode: '000-000',type: 'other-type'}]}
var Log = require('../../logger/elk/elk-logger');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

module.exports = function (requestData){

    var fullUrl = service.vars.shs_reg_endpoint + '/api/shs/v1/units/register';
    var opts = { headers: {} };
    opts.headers['apikey'] = service.vars.shs_apikey;
    opts.method = 'POST';
    opts.data = requestData;
    try {
        var logger;
        var response = httpClient.request(fullUrl, opts);
        console.log('^^^^^^^^^^^^^^^^^^'+JSON.stringify(response));
        if (response.status == 201 || response.status == 200) {
            var data = JSON.parse(response.content).results;
            if(response.status == 200)
                state.vars.exists = 'true';
            return data;
        }
        else if(JSON.parse(response.content).message == 'Unit with serial number '+requestData.unitSerialNumber+' assigned to another client'){
            global.sayText(translate('serial_assigned',{'$serialNumber': requestData.unitSerialNumber},state.vars.shsLang));
            return null;
        }
        else if(JSON.parse(response.content).message == 'No unit found with serial number '+ requestData.unitSerialNumber || JSON.parse(response.content).message =='Unit with serial number '+ requestData.unitSerialNumber +' is not an OAF unit' || JSON.parse(response.content).message == 'validation failed' || JSON.parse(response.content).message == 'Unit with serial number not found'){
            logger = new Log();
            logger.error('Failed to register shs unit', {data: {response: response, request: requestData}});
            return 'wrong serial';
        }
        else {
            logger = new Log();
            logger.error('Failed to register shs unit', {data: {response: response, request: requestData}});
            if(response.status >= 500){
                global.sayText(translate('internal_error',{},state.vars.shsLang));
                return null;
            }
            return false;
        }
    } catch (error) {
        console.log('Error registering shs unit' +error);
        logger = new Log();
        logger.error('Error registering shs unit', {data: error});
        
    }
    return null;
};