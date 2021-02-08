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
    try {
        var logger;
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 201 || response.status == 200) {
            var data = JSON.parse(response.content).results;
            return data;
        }
        else if(JSON.parse(response.content).message == 'Unit with serial number '+requestData.unitSerialNumber+' assigned to another client'){
            global.sayText(translate('serial_assigned',{'$serialNumber': requestData.unitSerialNumber},state.vars.shsLang));
            return null;
        }
        else if(JSON.parse(response.content).message == 'No unit found with serial number '+ requestData.unitSerialNumber){
            return 'wrong serial';
        }
        else {
            if(response.status == 500)
                global.sayText(translate('internal_error',{},state.vars.shsLang));
            logger = new Log();
            logger.error('Failed to register shs unit', {data: response});
            return null;
        }
    } catch (error) {
        console.log('Error registering shs unit' +error);
        logger = new Log();
        logger.error('Error registering shs unit', {data: error});
        
    }
    return null;
};