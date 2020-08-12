/*
    Script: extension-survey.js
    Description: RW program extension survey for FPs and SEDOs
    Status: in progress
*/


var defaultEnvironment;
if(service.active){
    defaultEnvironment = 'prod'
}else{
    defaultEnvironment = 'dev'
}

var env;
if(service.vars.env === 'prod' || service.vars.env === 'dev'){
    env = service.vars.env;
}else{
    env = defaultEnvironment;
}

//initialize dataTables
var extension_main_menu_table = env === 'dev' ? env + '_extension_main_menu' : 'extension_main_menu';

// load in general functions
var msgs = require('./lib/msg-retrieve');
var admin_alert = require('./lib/admin-alert');
var populate_menu = require('./lib/populate-menu');
var get_menu_option = require('./lib/get-menu-option');
var questions = require('./dat/surveys'); 
var slack = require('../slack-logger/index');

// load in extension-specific modules
var reinit = require('./lib/ext-reinitization');
var ask = require('./lib/ext-ask-question');
var check_vid = require('./lib/ext-vid-verify');
var check_sedo = require('./lib/ext-sedo-verify');
var start_survey = require('./lib/ext-survey-start');
var checkstop = require('./lib/ext-check-stop');
var srvySessionManager = require('./lib/ext-resume-survey');
var testerPack = require('../tester-pack/testerPack');

// set various constants
const lang = project.vars.cor_lang;
const max_digits_for_input = project.vars.max_digits_for_input;
const max_digits_for_vid = project.vars.max_digits_for_vid;
const max_digits_for_sedo_id = project.vars.max_digits_for_sedo_id;
const timeout_length = project.vars.timeout_length;


if(env === 'prod'){
    service.vars.ExtSurveySessions = 'DT643b929207d5f6b9';
    service.vars.ExtensionFarmers = project.vars.ExtensionFarmersTableId;
    serive.vars.extensionTableId = project.vars.ExtensionSurveyTableId;
}else{
    service.vars.ExtSurveySessions = 'DT5c79b0c09ade8d5d';
    service.vars.ExtensionFarmers = project.vars.dev_ExtensionFarmersTableId;
    service.vars.extensionTableId = project.vars.dev_ExtensionSurveyTableId;
}
const inputHandlers = {};


var extensionTable =  project.initDataTableById(service.vars.extensionTableId);

// display welcome message and prompt user to choose their survey (AMA1, AMA2, GUS)
global.main = function(){
    sayText(msgs('ext_main_splash'));
    var menu = populate_menu(extension_main_menu_table, lang);
    if (typeof (menu) == 'string') {
        state.vars.current_menu_str = menu;
        sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        promptDigits('ext_main_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        state.vars.current_menu_str = menu[state.vars.input_menu_loc];
        sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
        promptDigits('ext_main_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
}

testerPack.registerTesterPackHandlers({lang: lang});

// input handler for survey type
addInputHandler('ext_main_splash', function(input){
    // redirect user based on their input menu selection


    if (state.vars.multiple_input_menus) {
        if (input == 44 && state.vars.input_menu_loc > 0) {
            state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
            state.vars.current_menu_str = menu;
            sayText(menu);
            promptDigits('ext_main_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
        else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
            state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc]
            state.vars.current_menu_str = menu;
            sayText(menu);
            promptDigits('ext_main_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
        else if (input == 44 && state.vars.input_menu_loc == 0) {
            sayText(msgs('invalid_input', {}, lang));
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
    }

    var selection = get_menu_option(input, extension_main_menu_table);
    if(selection === 'fp_training'){
        var menu = populate_menu('extension_fp_menu', lang);
        sayText(menu);
        promptDigits('fp_menu_handler', {   'submitOnHash' : false,
                                            'maxDigits'    : max_digits_for_input,
                                            'timeout'      : timeout_length });

    }
    else if(selection === 'gus'){
        sayText(msgs('sedo_enter_id'));
        promptDigits('sedo_enter_id',  {'submitOnHash'  : false,
                                        'maxDigits'     : max_digits_for_sedo_id,
                                        'timeout'       : timeout_length 
                                        });
    }
    else if(selection === 'tester_pack') {
        testerPack.startTesterPack({lang: lang});
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('ext_main_splash', { 'submitOnHash'   : false, 
                                            'maxDigits'    : max_digits_for_input,
                                            'timeout'      : timeout_length});
    }
});

// input handler for fp training menu
addInputHandler('fp_menu_handler', function(input){

    var selection = get_menu_option(input, 'extension_fp_menu');
    if(selection === 'ama1' || selection === 'ama2'){
        state.vars.selection = selection;
        sayText(msgs('fp_enter_id'));
        promptDigits('fp_enter_id', {   'submitOnHash' : false,
                                        'maxDigits'    : max_digits_for_vid,
                                        'timeout'      : timeout_length 
                                    });
    }
    else{
        sayText(msgs('fp_enter_id', {}, lang));
        promptDigits('fp_menu_handler', { 'submitOnHash'   : false, 
                                            'maxDigits'    : max_digits_for_input,
                                            'timeout'      : timeout_length});

    }

}),

inputHandlers['fp_enter_id'] =  function(input){
    // verify village id
    input = input.replace(/\s/g,'');
    if(check_vid(input)){
        state.vars.village_id = input;
        //Allow this specific id to be used for testing with reinitialization not working
        if(state.vars.village_id == '10000000'){state.vars.testing = true}else{state.vars.testing = false};
        if(state.vars.survey_type == 'ext'){
            sayText(msgs('ext_farmer_national_id',{},lang));
            promptDigits('ext_national_id_handler', {   'submitOnHash' : false,
            'maxDigits'    : 16,
            'timeout'      : timeout_length 
        });

        }
        else{

        state.vars.survey_type = 'tra';
        state.vars.step = 1;
        // return user to previous step if they are coming back to the survey
        if(reinit()){
            ask();
        }
        else{
            // initialize counter variables
            state.vars.num_correct = 0;
            // begin the crop survey if demo questions are complete
            if(state.vars.step > 1 || state.vars.selection === 'ama2'){
                console.log('starting survey...');
                start_survey();
            }
            else{
                sayText(msgs('fp_tr_num', {}, lang));
                promptDigits('demo_question', {     'submitOnHash' : false, 
                                                    'maxDigits'    : max_digits_for_input,
                                                    'timeout'      : timeout_length});
            }
        }
    }
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('fp_enter_id', {   'submitOnHash' : false,
                                        'maxDigits'    : max_digits_for_vid,
                                        'timeout'      : timeout_length 
                                    });
    }
};



// input handler for FP's village ID
addInputHandler('fp_enter_id', inputHandlers['fp_enter_id']);

inputHandlers['ext_national_id_handler'] = function(input){

    state.vars.current_menu_str = msgs('ext_farmer_national_id',{},lang);
    state.vars.current_step = 'ext_national_id_handler';
    nationalId = String(input.replace(/\D/g, ''));

    if(nationalId.length != 16){
        sayText(msgs('ext_invalid_national_id',{},lang));
        promptDigits('ext_national_id_handler', {   'submitOnHash' : false,
        'maxDigits'    : 16,
        'timeout'      : timeout_length 
    });

    }
    else{
    var cursor = extensionTable.queryRows({'vars' : {'national_id' : nationalId}});
    if(cursor.hasNext()){
        var row = cursor.next();
        if(row.vars.not_eligible == 1){
            sayText(msgs('ext_farmerId_used_NE',{},lang));
            stopRules();
            return null;
        }
        else if(row.vars.not_eligible == 0){
            sayText(msgs('ext_farmerId_used_RE',{},lang));
            stopRules();
            return null;
        }
        else{
            srvySessionManager.save(contact.phone_number,state.vars,'ext_national_id_handler',input);
            state.vars.nationalId = nationalId;
            sayText(msgs('ext_farmer_name_1',{},lang));
            promptDigits('ext_first_name_handler', {   'submitOnHash' : false,
            'maxDigits'    : 16,
            'timeout'      : timeout_length 
        });

        }
    }
    else{
        srvySessionManager.save(contact.phone_number,state.vars,'ext_national_id_handler',input);
        state.vars.nationalId = nationalId;
        sayText(msgs('ext_farmer_name_1',{},lang));
        promptDigits('ext_first_name_handler', {   'submitOnHash' : false,
        'maxDigits'    : 16,
        'timeout'      : timeout_length 
    });

    }
    }

};

// input handler to get farmer national Id for extension
addInputHandler('ext_national_id_handler', inputHandlers['ext_national_id_handler']);

inputHandlers['ext_first_name_handler'] = function(input){

    state.vars.current_menu_str = msgs('ext_farmer_name_1',{},lang);
    state.vars.current_step = 'ext_first_name_handler';
    if(input == '9999'){
        sayText(msgs('exiting',{},lang));
        srvySessionManager.clear(contact.phone_number);
        stopRules();
        return null;
    }
    else{
    srvySessionManager.save(contact.phone_number,state.vars,'ext_first_name_handler',input);
    state.vars.firstN = input;
    sayText(msgs('ext_farmer_name_2',{},lang));
    promptDigits('ext_last_name_handler', {   'submitOnHash' : false,
    'maxDigits'    : 16,
    'timeout'      : timeout_length 
});
    }

};

// Input handler to get the farmer's first name
addInputHandler('ext_first_name_handler', inputHandlers['ext_first_name_handler']);

inputHandlers['ext_last_name_handler'] = function(input){

    state.vars.current_menu_str = msgs('ext_farmer_name_2',{},lang);
    state.vars.current_step = 'ext_last_name_handler';
    if(input == '9999'){
        sayText(msgs('exiting',{},lang));
        srvySessionManager.clear(contact.phone_number);
        stopRules();
    }
    else{
        srvySessionManager.save(contact.phone_number,state.vars,'ext_last_name_handler',input);
        state.vars.lastN = input;
        sayText(msgs('ext_farmer_gender',{},lang));
        promptDigits('gender_input_handler', {   'submitOnHash' : false,
        'maxDigits'    : 16,
        'timeout'      : timeout_length 
    });
        }

};

// Input handler to get the farmer's last name
addInputHandler('ext_last_name_handler', inputHandlers['ext_last_name_handler']);

inputHandlers['gender_input_handler'] = function(input){
    
    state.vars.current_menu_str = msgs('ext_farmer_gender',{},lang);
    state.vars.current_step = 'gender_input_handler';
    if(input == '9999'){
        sayText(msgs('exiting',{},lang));
        srvySessionManager.clear(contact.phone_number);
        stopRules();
    }
    else if(input == 1 ){
        srvySessionManager.save(contact.phone_number,state.vars,'gender_input_handler',input); 
        state.vars.gender = input;
        sayText(msgs('ext_farmer_phone',{},lang));
        promptDigits('ext_phone_input_handler', {   'submitOnHash' : false,
        'maxDigits'    : 10,
        'timeout'      : timeout_length 
    });
        }
    else if(input == 2 ){
        srvySessionManager.save(contact.phone_number,state.vars,'gender_input_handler',input); 
        state.vars.gender = input;
        sayText(msgs('ext_farmer_phone',{},lang));
        promptDigits('ext_phone_input_handler', {   'submitOnHash' : false,'maxDigits'    : 10,'timeout'      : timeout_length });
        }
    else{
        sayText(msgs('invalid_entry',{},lang));
        promptDigits('invalid_input', {   'submitOnHash' : false,'maxDigits'    : 10,'timeout'      : timeout_length });

    }


};

// Input handler to get the farmer's gender
addInputHandler('gender_input_handler', inputHandlers['gender_input_handler']);


inputHandlers['ext_phone_input_handler']  =  function(input){
    
    state.vars.current_menu_str = msgs('ext_farmer_phone',{},lang);
    state.vars.current_step = 'ext_phone_input_handler';
    if(input == '9999'){
        sayText(msgs('exiting',{},lang));
        srvySessionManager.clear(contact.phone_number);
        stopRules();
        return null;
    }
    else if(input.length === 10 && input.substring(0, 2)=="07"){
        srvySessionManager.save(contact.phone_number,state.vars,'ext_phone_input_handler',input); 
        state.vars.phoneNumber = input;
        state.vars.qstnNber = 1;
        state.vars.qtsn = 'ext_farmer_question'+ state.vars.qstnNber;
        sayText(questions['extension-survey'][state.vars.qtsn][lang]);
        promptDigits('extension_questions', {   'submitOnHash' : false,'maxDigits'    : 2,'timeout'      : timeout_length });
    }
    else{
        sayText(msgs('invalid_entry',{},lang));
        promptDigits('invalid_input', {   'submitOnHash' : false,'maxDigits'    : 1,'timeout'      : timeout_length });

    }
};

// Input handler to get the farmer's phone number
addInputHandler('ext_phone_input_handler', inputHandlers['ext_phone_input_handler']);

function answerCorrect(input){
    if(questions['extension-survey'][state.vars.qtsn]['correct'] == input){return true}
    else{ return false}

}


inputHandlers['extension_questions'] = function(input){

    state.vars.current_menu_str = questions['extension-survey'][state.vars.qtsn][lang];
    state.vars.current_step = 'extension_questions';
    if(input == '9999'){
        sayText(msgs('exiting',{},lang));
        srvySessionManager.clear(contact.phone_number);
        stopRules();
        return null;
    }
    // The input should be 1 or 2 here
    else if(!(input == 1 || input == 2)){
        sayText(msgs('invalid_entry',{},lang));
        promptDigits('invalid_input', {   'submitOnHash' : false,'maxDigits'    : 1,'timeout'      : timeout_length });
    }
        
    else if(!answerCorrect(input)){
        sayText(msgs('ext_farmer_not_eligible',{},lang));
        // load the rows of village table that match the input vid
        var village_table = project.getOrCreateDataTable("VillageInfo");
        var village_cursor = village_table.queryRows({vars: {'villageid' : state.vars.village_id}});
        if(village_cursor.hasNext()){
            var row = village_cursor.next();
            state.vars.sector = row.vars.sector;
            state.vars.cell = row.vars.cell;
            state.vars.village = row.vars.village;
        }
        else{
            slack.log('Failed to get sector and cell from village Id: \n'+state.vars.village_id);
        }
        var failure_details = 'The farmer is disqualified because of '+ questions['extension-survey'][state.vars.qtsn][lang]+' question';
        var row = extensionTable.createRow({ 'vars': {'first_name': state.vars.firstN, 'last_name':  state.vars.lastN,'gender': state.vars.gender, 'national_id': state.vars.nationalId, 'phone_number': state.vars.phoneNumber, 'registration_status': 'Rejected','Sector': state.vars.sector, 'Cell': state.vars.cell, 'Village':state.vars.village , 'VillageId': state.vars.village_id, 'Time_Created_Registration': new Date().toString(), 'not_eligible': 1, 'failure_details': failure_details}});
        srvySessionManager.clear(contact.phone_number);
        row.save();
        stopRules();
        return null;
    }

    else if(state.vars.qstnNber < questions['extension-survey']['info']['number_of_questions']){
        srvySessionManager.save(contact.phone_number,state.vars,'extension_questions',input); 
        state.vars.qstnNber = state.vars.qstnNber + 1;
        state.vars.qtsn = 'ext_farmer_question'+ state.vars.qstnNber;
        sayText(questions['extension-survey'][state.vars.qtsn][lang]);
        promptDigits('extension_questions', {   'submitOnHash' : false,'maxDigits'    : 2,'timeout'      : timeout_length });
    
    }
    else{
        // load the rows of village table that match the input vid
        var village_table = project.getOrCreateDataTable("VillageInfo");
        var village_cursor = village_table.queryRows({vars: {'villageid' : state.vars.village_id}});
        if(village_cursor.hasNext()){
            var row = village_cursor.next();
            state.vars.sector = row.vars.sector;
            state.vars.cell = row.vars.cell;
            state.vars.village = row.vars.village;
        }
        else{
            slack.log('Failed to get sector and cell from village Id: \n'+state.vars.village_id);
        }
        var table = project.initDataTableById(service.vars.ExtensionFarmers);
        var row = table.createRow({ 'vars': { 'national_id': state.vars.nationalId, 'first_name': state.vars.firstN, 'last_name': state.vars.lastN, 'gender' : state.vars.gender, 'phone_number': state.vars.phoneNumber,'village_id': state.vars.village_id,'Sector': state.vars.sector, 'Cell': state.vars.cell}});
        row.save();
        var rowAll = extensionTable.createRow({ 'vars': {'first_name': state.vars.firstN, 'last_name':  state.vars.lastN,'gender': state.vars.gender, 'national_id': state.vars.nationalId, 'phone_number': state.vars.phoneNumber, 'registration_status': 'Successful','Sector': state.vars.sector, 'Cell': state.vars.cell, 'Village':state.vars.village , 'VillageId': state.vars.village_id, 'Time_Created_Registration': new Date().toString(), 'not_eligible': 0}});
        rowAll.save();
        sayText(msgs('ext_farmer_confirmation',{},lang));
        srvySessionManager.clear(contact.phone_number);
        stopRules();
    }

};

//Yes or no questions input handle 
addInputHandler('extension_questions', inputHandlers['extension_questions']);

// input handler for SEDO ID
addInputHandler('sedo_enter_id', function(input){
    // check sedo id
    input = input.replace(/\s/g,'');
    // if sedo id is valid, prompt user to enter village id; otherwise request user to re-enter sedo id
    if(check_sedo(input)){
        sayText(msgs('sedo_enter_vid', {}, lang));
        promptDigits('sedo_enter_vid', {    'submitOnHash' : false, 
                                            'maxDigits'    : max_digits_for_vid,
                                            'timeout'      : timeout_length});
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('sedo_enter_id', {     'submitOnHash' : false, 
                                            'maxDigits'    : max_digits_for_sedo_id,
                                            'timeout'      : timeout_length});
    }
});

// input handler for SEDO's village ID
addInputHandler('sedo_enter_vid', function(input){
    input = input.replace(/\s/g,'');
    // initialize tracker variables
    state.vars.step = 1;
    state.vars.survey_type = 'mon';
    if(check_vid(input)){
        // check reinitization
        if(reinit()){
            ask();
        }
        // display text and prompt user to select their choice
        if(state.vars.step > 1){
            start_survey();
        }
        else{
            sayText(msgs('fp_gender', {}, lang));
            promptDigits('demo_question', {     'submitOnHash' : false, 
                                                'maxDigits'    : max_digits_for_input,
                                                'timeout'      : timeout_length});
        }
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('sedo_enter_vid', {    'submitOnHash' : false, 
                                            'maxDigits'    : max_digits_for_vid,
                                            'timeout'      : timeout_length});
    }
});

// input handler for demographic questions
addInputHandler('demo_question', function(input){
    input = parseInt(input.replace(/\s/g,''));
    if(checkstop(input)){
        return null;
    }
    call.vars.status = state.vars.survey_type + state.vars.step;
    if(input || input === 0){
        // save input in session data
        var demo_table = project.getOrCreateDataTable('demo_table');
        var prev_question = demo_table.queryRows({'vars' : {'question_id' : state.vars.survey_type + state.vars.step}}).next();
        call.vars[prev_question.vars.msg_name] = input;
        // check if input falls within criteria
        var max = prev_question.vars.answer_max;
        var min = prev_question.vars.answer_min || 0;
        console.log('max/min: ' + max + '/' + min + ' input: ' + input + ' ' + typeof(input));
        if(input <= max && input >= min){
            console.log('met within criteria');
            // if there are still questions remaining, ask the next question; otherwise start the crop quiz
            state.vars.step = state.vars.step + 1;
            var question_cursor = demo_table.queryRows({'vars' : {'question_id' : state.vars.survey_type + state.vars.step}});
            if(question_cursor.hasNext()){
                var question = question_cursor.next();
                // display text and prompt user to select their choice
                sayText(msgs(question.vars.msg_name, {}, lang));
                promptDigits('demo_question', {     'submitOnHash' : false, 
                                                    'maxDigits'    : project.vars.max_digits_for_input,
                                                    'timeout'      : timeout_length});
            }
            else{
                // load village table and mark as completed
                var village_table = project.getOrCreateDataTable("VillageInfo");
                var village = village_table.queryRows({vars: {'villageid' : state.vars.vid}}).next();
                if(state.vars.survey_type === 'mon' && !village.vars.test){
                    village.vars.demo_complete = true;
                    village.save();
                }
                // begin the crop survey
                start_survey();
            }
        }
        else{
            sayText(msgs('invalid_input', {}, lang));
            promptDigits('demo_question', {   'submitOnHash' : false, 
                                                    'maxDigits'    : project.vars.max_digits_for_input,
                                                    'timeout'      : timeout_length});
        }
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('demo_question', {   'submitOnHash' : false, 
                                            'maxDigits'    : project.vars.max_digits_for_input,
                                            'timeout'      : timeout_length});
    }
});

// input handler for crop demographic questions
addInputHandler('crop_demo_question', function(input){
    input = parseInt(input.replace(/\s/g,''));
    if(checkstop(input)){
        return null;
    }
    call.vars.status = state.vars.survey_type + state.vars.step;
    if(input || input === 0){
        var demo_table = project.getOrCreateDataTable('demo_table');
        var within = true;
        console.log('step is ' + state.vars.step + ', survey is ' + state.vars.survey_type);
        var question_cursor = demo_table.queryRows({'vars' : {  'question_id' : state.vars.survey_type + state.vars.step}});
        // if entering for the first time, save the crop
        if(state.vars.step === 1){
            state.vars.crop = get_menu_option(input, 'crop_menu');
            call.vars['crop'] = state.vars.crop;
        }
        else{
            // save input in session data
            var prev_question = demo_table.queryRows({'vars' : {  'question_id' : state.vars.survey_type + (state.vars.step - 1)}}).next();
            var max = prev_question.vars.answer_max;
            var min = prev_question.vars.answer_min || 0;
            if(input < min || input > max){
                within = false;
            }
            call.vars[prev_question.vars.msg_name] = input;
        }
        if(within){
            console.log('input was within' + within);
            // if there are questions remaining, ask the next question; otherwise start the survey
            if(question_cursor.hasNext()){
                var question = question_cursor.next();
                state.vars.step = state.vars.step + 1;
                sayText(msgs(question.vars.msg_name, {}, lang));
                promptDigits('crop_demo_question', {'submitOnHash' : false, 
                                                    'maxDigits'    : project.vars.max_digits_for_input,
                                                    'timeout'      : timeout_length});
            }
            else{
                // set question id in correct format, then increment the question number
                state.vars.question_number = state.vars.question_number || 1;
                state.vars.question_id = String(state.vars.crop + 'Q' + state.vars.question_number);
                call.vars.status = String('Q' + state.vars.question_number);
                // ask the survey question
                ask();
            }
        }
        else{
            sayText(msgs('invalid_input', {}, lang));
            promptDigits('crop_demo_question', {   'submitOnHash' : false, 
                                                    'maxDigits'    : project.vars.max_digits_for_input,
                                                    'timeout'      : timeout_length});
        }
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('crop_demo_question', {   'submitOnHash' : false, 
                                                'maxDigits'    : project.vars.max_digits_for_input,
                                                'timeout'      : timeout_length});
    }
}); 

// input handler for survey questions
addInputHandler('survey_response', function(input){
    console.log('4 q is ' + state.vars.question_number + ' id is ' + state.vars.question_id);
    input = parseInt(input.replace(/\s/g,''));
    call.vars.status = String('Q' + state.vars.question_number);
    call.vars[call.vars.status] = input; 
    console.log('question number is: ' + state.vars.question_number);
    if(checkstop(input)){
        return null;
    }
    // if entering for the first time, save the crop then ask the first question
    if(!state.vars.crop){
        state.vars.crop = get_menu_option(input, 'crop_menu');
        call.vars['crop'] = state.vars.crop;
        state.vars.question_id = String(state.vars.crop + 'Q' + state.vars.question_number);
        call.vars.status = String('Q' + state.vars.question_number);
        // ask the survey question
        ask();
    }
    else{
        // save answer to demo question in session data
        if(state.vars.question_number === 1 && state.vars.survey_type === 'mon'){
            var demo_table = project.getOrCreateDataTable('demo_table');
            var prev_question = demo_table.queryRows({'vars' : {  'question_id' : state.vars.survey_type + (state.vars.step - 1)}}).next();
            call.vars[prev_question.vars.msg_name] = input;
        }
        // say closing message and end survey if all questions are complete
        var feedback = require('./lib/ext-answer-verify')(input);
        var survey_length = 10; // abstract
        console.log('question number: ' + state.vars.question_number + ' of type ' + typeof(state.vars.question_number));
        if(state.vars.question_number === survey_length){
            call.vars.completed = 'complete';
            // label as first take if there aren't any other first takes
            var session_table = project.getOrCreateDataTable('Extension Survey');
            var session_cursor = session_table.queryRows({
                vars        : { 'villageid' : state.vars.vid,
                                'ext_main_splash' : String(call.vars.ext_main_splash),
                                'first_take' : 'true',
                                'crop' : state.vars.crop}
            });
            console.log('menu selection: ' + call.vars.ext_main_splash + ' ' + typeof(call.vars.ext_main_splash));
            if(session_cursor.hasNext()){
                call.vars.first_take = false;
            }
            else{
                call.vars.first_take = true;
            }
            // report the closing message with the number correct
            sayText(msgs('closing_message', {   '$FEEDBACK'    : feedback,
                                                '$NUM_CORRECT' : state.vars.num_correct}, lang));
        }
        else{
            // set question id in correct format, then increment the question number
            state.vars.question_id = String(state.vars.crop + 'Q' + state.vars.question_number);
            state.vars.question_number = state.vars.question_number + 1;
            // ask the survey question
            ask(feedback);
        }
    }
});  
addInputHandler('invalid_input', function (input) {
    input = parseInt(input.replace(/\D/g, ''));

    if (input == 1) { //continue on to previously failed step
        sayText(state.vars.current_menu_str);
        promptDigits(state.vars.current_step, { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        return null;
    }
    else if (input == 99) { //exit
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
});