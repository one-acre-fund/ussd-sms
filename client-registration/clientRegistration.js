var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var rosterRegisterClient = require('../rw-legacy/lib/roster/register-client');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var confirmNationalIdHandler = require('./confirm-national-id-handler/confirmNationalIdHandler');
var confirmPhoneNumberHandler = require('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
var firstNameHandler = require('./first-name-handler/firstNameHandler');
var nationalIdHandler = require('./national-id-handler/nationalIdHandler');
var phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
var secondNameHandler = require('./second-name-handler/secondNameHandler');
var groupLeaderQuestionHander = require('./group-leader-question-handler/groupLeaderQuestionHandler');

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
            global.sayText(translate('reg_group_leader_question',{},state.vars.reg_lang));
            global.promptDigits(groupLeaderQuestionHander.handlerName);
        }
        function onGroupLeaderQuestion(){
            var client = JSON.parse(state.vars.client_json);
            console.log('client Data ****************' + client.AccountNumber);
            var clientJSON = {
                'districtId': client.DistrictId,
                'siteId': client.SiteId,
                'groupId': client.GroupId,
                'firstName': state.vars.firstName,
                'lastName': state.vars.lastName,
                'nationalIdNumber': state.vars.nationalId,
                'phoneNumber': state.vars.phoneNumber
            };
            try {
                var clientData = JSON.parse(rosterRegisterClient(clientJSON,state.vars.reg_lang));
                if(clientData){
                    console.log('client Data ****************' + clientData.AccountNumber);
                    var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
                    var foInfo = getFOInfo(clientData.DistrictId,clientData.SiteId,state.vars.reg_lang);
                    var message;
                    if((foInfo == null) || (foInfo.phoneNumber == null || foInfo.phoneNumber == undefined)){
                        message = translate('reg_complete_message_no_phone' , {'$ACCOUNT_NUMBER': clientData.AccountNumber}, state.vars.reg_lang);
                    }
                    else{
                        message = translate('reg_complete_message' , {'$ACCOUNT_NUMBER': clientData.AccountNumber,'$FOphone': foInfo.phoneNumber}, state.vars.reg_lang);
                    }
                    sayText(message);
                    project.sendMessage({content: message, to_number: contact.phone_number});
                    project.sendMessage({content: message, to_number: clientJSON.phoneNumber});
                    var table = project.initDataTableById(service.vars.lr_2021_client_table_id);
                    var row = table.createRow({
                        'contact_id': contact.id,
                        vars: {
                            'account_number': clientData.AccountNumber,
                            'national_id': clientData.NationalId,
                            'client_phone_number': clientJSON.phoneNumber,
                            'first_name': clientData.FirstName,
                            'last_name': clientData.LastName,
                            'district': clientData.DistrictId,
                            'site': clientData.SiteId,
                            'new_client': '1',
                            'gl_interested': state.vars.groupLeader,
                            'gl_phone_number': contact.phone_number,

                        }
                    });
                    row.save();
                }
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
        addInputHandler(groupLeaderQuestionHander.handlerName, groupLeaderQuestionHander.getHandler(onGroupLeaderQuestion));
    },
    

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.reg_lang = lang;
        global.sayText(translate('national_id_handler',{},state.vars.reg_lang));
        global.promptDigits(nationalIdHandler.handlerName);
    }
};
