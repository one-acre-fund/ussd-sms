var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var rosterRegisterClient = require('../rw-legacy/lib/roster/register-client');

var confirmNationalIdHandler = require('./confirm-national-id-handler/confirmNationalIdHandler');
var confirmPhoneNumberHandler = require('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
var firstNameHandler = require('./first-name-handler/firstNameHandler');
var nationalIdHandler = require('./national-id-handler/nationalIdHandler');
var phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
var secondNameHandler = require('./second-name-handler/secondNameHandler');

module.exports = {
    registerHandlers: function (){
        
        function onNationalIdValidated(nationalId){
            state.vars.nationalId = nationalId;
            global.sayText(translate('confirm_national_id',{'$nationalId': nationalId},state.vars.reg_lang));
            global.promptDigits(confirmNationalIdHandler.handlerName);
        }
        function onNationalIdConfirmation(){
            global.sayText(translate('first_name_prompt',{},state.vars.reg_lang));
            global.promptDigits(firstNameHandler.handlerName);
        }
        function onFirstNameReceived(firstName){
            state.vars.firstName = firstName;
            global.sayText(translate('second_name_prompt',{},state.vars.reg_lang));
            global.promptDigits(secondNameHandler.handlerName);
        }
        function onSecondNameReceived(lastName){
            state.vars.lastName = lastName;
            global.sayText(translate('phone_number_prompt',{},state.vars.reg_lang));
            global.promptDigits(phoneNumberHandler.handlerName);
        }
        function onPhoneNumberValidated(phoneNumber){
            state.vars.phoneNumber = phoneNumber;
            global.sayText(translate('confrm_phone_prompt',{'$phone': phoneNumber},state.vars.reg_lang));
            global.promptDigits(confirmPhoneNumberHandler.handlerName);
        }
        function onPhoneNumberConfirmed(){
            var client = JSON.parse(state.vars.client_json);
            
            var clientJSON = {
                'districtId': client.GroupId,
                'siteId': client.SiteId,
                'groupId': client.DistrictId,
                'firstName': state.vars.firstName,
                'lastName': state.vars.lastName,
                'nationalIdNumber': state.vars.nationalId,
                'phoneNumber': state.vars.phoneNumber
            };
            try {
                var clientData = JSON.parse(rosterRegisterClient(clientJSON));
                console.log('client Data ****************' + clientData.AccountNumber);
                // var table = project.initDataTableById('DTcb22aac587c755c5');
                // var row = table.createRow({
                //     vars: {
                //         'Accountnumber': clientData.AccountNumber,
                //         'Phonenumber': clientJSON.phoneNumber,
                //         'firstName': clientJSON.firstName,
                //         'lastName': clientJSON.lastName,
                //         'nationalIdNumber': clientJSON.nationalIdNumber,
                //         'siteId': clientJSON.siteId,
                //         'groupId': clientJSON.groupId,
                //         'districtId': clientJSON.districtId,
                //         'from_number': contact.phone_number,
                //         'new_client': 'true'
                //     }
                // });
                // row.save();
                var message = translate('reg_complete_message' , {'$ACCOUNT_NUMBER': clientData.AccountNumber}, state.vars.reg_lang);
                project.sendMulti({
                    messages: [
                        {content: message, to_number: contact.phone_number}, 
                        {content: message, to_number: clientJSON.phoneNumber}],
                        message_type: 'text'});

            }
            catch (e) {
                console.log('error getting account number from roster' + e);
            }
            
        }

        addInputHandler(confirmNationalIdHandler.handlerName, confirmNationalIdHandler.getHandler(onNationalIdConfirmation));
        addInputHandler(confirmPhoneNumberHandler.handlerName, confirmPhoneNumberHandler.getHandler(onPhoneNumberConfirmed));
        addInputHandler(firstNameHandler.handlerName, firstNameHandler.getHandler(onFirstNameReceived));
        addInputHandler(nationalIdHandler.handlerName, nationalIdHandler.getHandler(onNationalIdValidated));
        addInputHandler(phoneNumberHandler.handlerName, phoneNumberHandler.getHandler(onPhoneNumberValidated));
        addInputHandler(secondNameHandler.handlerName, secondNameHandler.getHandler(onSecondNameReceived));
    },

    start: function (account, country,lang) {
        state.vars.account = account;
        state.vars.country = country;
        state.vars.reg_lang = lang;
        global.sayText(translate('national_id_handler'));
        global.promptDigits(nationalIdHandler.handlerName);
    }
};
