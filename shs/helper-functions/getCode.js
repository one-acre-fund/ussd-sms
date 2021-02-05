
var getCodes = require('../endpoints/getCode');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);


module.exports = function getcode(account){
    var countryCode;
    if(state.vars.country == 'KE')
        countryCode = '404';
    if(JSON.parse(state.vars.client).BalanceHistory[0].SeasonName == '2021, Long Rain'){
        var requestData = {
            accountNumber: account,
            countryCode: countryCode
        };
        return getCodes(requestData);
    }
    else{
        global.sayText(translate('not_enrolled',{},state.vars.shsLang));
        return null;
    }
};

