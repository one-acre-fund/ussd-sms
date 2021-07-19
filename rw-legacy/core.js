/*
OAF RW core program
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

service.vars.server_name = project.vars[env+'_server_name'];
service.vars.roster_api_key = project.vars[env+'_roster_api_key'];
service.vars.market_access_table = project.vars[env+'_market_access_table_id'];
service.vars.ussd_settings_table_id = 'DT1f9908b578f65458';
service.vars.groupCodes_id = 'DTf1ac46f52abd0c5e';
service.vars.currency = 'RwF';
service.vars.roster_read_key = project.vars.roster_read_key;
service.vars.micro_entrepreneur = project.vars[env + '_mkt_access_entrepreneurs'];

var account_splash_menu_name = '';
if(env === 'prod'){
    service.vars.season_clients_table = project.vars.season_clients_table;
    service.vars.client_enrollment_table = project.vars.client_enrollment_data;
    service.vars.input21ATable = project.vars.input21ATable;
    service.vars.input21ATable_id = project.vars.input21ATable_id;
    service.vars.RegistrationSessions = project.vars.RegistrationSessions;
    service.vars['21a_client_data_id'] = project.vars['21a_client_data_id'];
    service.vars.client_enrollment_table_id = project.vars.client_enrollment_data_id;
    service.vars.market_access_table_id = 'DT278868f96626c4b0';
    service.vars.Valid_Serial_Number_table = 'Valid_Serial_Number';
    service.vars.chicken_table_id = 'DT588706b3a7513443';
    account_splash_menu_name = 'core_enr_splash_menu';
    service.vars.avocado_table_id = 'DT864c12fe76c43eaf';
    service.vars.rw_reg_client_table_id = 'DT29e542bf090b050f';
    service.vars.groupCodeTableId = project.vars.groupCodeTableId;
    service.vars.endEnrollmentTableId = project.vars.EnrollmentEndTableId;
    service.vars.bundles_table = 'DT61e723e06de35a67'
}else{
    service.vars.season_clients_table = 'dev_' + project.vars.season_clients_table;
    service.vars.client_enrollment_table = 'dev_' + project.vars.client_enrollment_data;
    service.vars.input21ATable = project.vars.dev_inputTable21A;
    service.vars.input21ATable_id = project.vars.dev_input21ATable_id;
    service.vars.RegistrationSessions = 'dev_'+ project.vars.RegistrationSessions;
    service.vars['21a_client_data_id'] = project.vars.dev_22AClientTableID;
    service.vars.client_enrollment_table_id = project.vars.dev_client_enrollment_data_id;
    service.vars.market_access_table_id = 'DT627b1e89d0150102';
    service.vars.Valid_Serial_Number_table = 'dev_Valid_Serial_Number';
    account_splash_menu_name = 'dev_core_enr_splash_menu';
    account_splash_menu_name = 'dev_core_enr_splash_menu';
    service.vars.chicken_table_id = 'DT8c3e091b499f1726';
    service.vars.avocado_table_id = 'DT32fb8b273aacf654';
    service.vars.chicken_table_id = 'DT8c3e091b499f1726';
    service.vars.rw_reg_client_table_id = 'DT41914a4d2dc6a29f';
    service.vars.groupCodeTableId = project.vars.dev_groupCodeTableId;
    service.vars.endEnrollmentTableId = project.vars.dev_EnrollmentEndTableId;
    service.vars.bundles_table = 'DT92be9913918ab014'
}

var client_table = project.initDataTableById(service.vars['21a_client_data_id']);
// console.log('###Env Info###');
// console.log(JSON.stringify(service.vars));
// console.log('### End Env Info###');

var lang = service.vars.lang || project.vars.cor_lang;
service.vars.lang = lang;

var notifyELK = require('../notifications/elk-notification/elkNotification');
//global functionss
var msgs = require('./lib/msg-retrieve'); //global message handler
var populate_menu = require('./lib/populate-menu');

// load in geo modules and data for locator services
var get_client = require('./lib/enr-retrieve-client-row');
var regSessionManager = require('./lib/enr-resume-registration');
var chickenServices = require('../chicken-services/chickenServices');
var transactionHistory = require('../transaction-history/transactionHistory');
var groupRepaymentsModule = require('../group-repayments/groupRepayments');
var avocadoTreesOrdering = require('../avocado-trees-ordering/avocadoTreesOrdering');
var clientRegistration = require('../client-registration/clientRegistration');
var marketAccess = require('../market-access/marketAccess');
//options
const max_digits_for_input = project.vars.max_digits; //only for testing
//const max_digits_for_nid = parseInt(settings_table.queryRows({'vars' : {'settings' : 'max_digits_nid'}}).next().vars.value); 
const max_digits_for_account_number = project.vars.max_digits_an;
//const max_digits_for_serial = 7;
//const chicken_client_table = project.vars.chicken_client_table;
const an_pool = service.vars.season_clients_table;
const glus_pool = project.vars.glus_pool;
const timeout_length = project.vars.max_digits_for_input_enrollement;
const max_digits_for_nid = project.vars.max_digits_nid;
const max_digits_for_pn = project.vars.max_digits_pn;
const max_digits_for_glus = project.vars.max_digits_glvv;
const max_digits_for_name = project.vars.max_digits_name;
const inputHandlers = {}
clientRegistration.registerHandlers();
marketAccess.registerHandlers();

global.main = function () {
    sayText(msgs('cor_enr_main_splash',{},lang));
    promptDigits('account_number_splash', {
        'submitOnHash': false,
        'maxDigits': 2,
        'timeout': timeout_length
    });
};

// addInputHandler('main_menu_splash',function(input){
//     notifyELK();
//     input = String(input.replace(/\D/g, ''));
//     if(input == 1){
//         clientRegistration.start(0,'RW',lang);
//         stopRules();
//     }
//     else if(input == 2){
//         sayText(msgs('cor_enr_main_splash',{},lang));
//         promptDigits('account_number_splash', {
//             'submitOnHash': false,
//             'maxDigits': max_digits_for_account_number,
//             'timeout': timeout_length
//         });
//     }
//     else{
//         sayText(msgs('main_menu',{},lang));
//         promptDigits('main_menu_splash', {
//             'submitOnHash': false,
//             'maxDigits': 2,
//             'timeout': timeout_length
//         });
//     }
// });

/*
input handlers - one per response variable
*/
addInputHandler('account_number_splash', function (input) { //acount_number_splash input handler - main input handler for initial splash
    notifyELK();
    var response = input.replace(/\D/g, '');
    if (response == 1) {
        //
        sayText(msgs('registration_ended', {}, lang));
        stopRules();
        // this code is to be uncommented when enrollment starts again
        // const resumedSession = regSessionManager.resume(contact.phone_number, inputHandlers);
        // if(!resumedSession){
        //     var current_menu = msgs('enr_reg_start', {}, lang);
        //     state.vars.current_menu_str = current_menu;
        //     sayText(current_menu);
        //     promptDigits('enr_reg_start', { 'submitOnHash': false, 'maxDigits': max_digits_for_nid, 'timeout': timeout_length });
        // }
    } else if(response == 99) { // use 99 to change the language
        lang = service.vars.lang == 'ki' ? 'en' : 'ki'
        service.vars.lang = lang;
        sayText(msgs('cor_enr_main_splash',{},lang));
        promptDigits('account_number_splash', {
            'submitOnHash': false,
            'maxDigits': 2,
            'timeout': timeout_length
        });
    }
    else if(response == 2 ){
        
        sayText(msgs('nonClientMenu',{},lang));
        promptDigits('nonClientMenu_splash', {
            'submitOnHash': false,
            'maxDigits': 2,
            'timeout': timeout_length
        });
    }
    else {
        try {
            var verify = require('./lib/account-verify')
            var client_verified = verify(response);
            state.vars.account_number = response;
            if (client_verified) {
                var checkGroupLeader = require('../shared/rosterApi/checkForGroupLeader');
                var isGroupLeader = checkGroupLeader(state.vars.client_districtId, state.vars.client_id);
                state.vars.isGroupLeader = isGroupLeader;  
                var splash = account_splash_menu_name;
                state.vars.splash = splash;
                var menu = populate_menu(splash, lang);
                if (typeof (menu) == 'string') {
                    state.vars.current_menu_str = menu;
                    sayText(menu);
                    state.vars.multiple_input_menus = 0;
                    state.vars.input_menu = menu;
                    state.vars.main_menu = menu;
                    promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
                }
                else if (typeof (menu) == 'object') {
                    state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
                    state.vars.multiple_input_menus = 1;
                    state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
                    state.vars.current_menu_str = menu[state.vars.input_menu_loc];
                    state.vars.main_menu = menu[state.vars.input_menu_loc]
                    sayText(menu[state.vars.input_menu_loc]);
                    state.vars.input_menu = JSON.stringify(menu);
                    promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
                }
            }
            else {
                sayText(msgs('account_number_not_found'));
            }

        }
        catch (error) {
            console.log(error);
            var admin_alert = require('./lib/admin-alert'); //global admin alerter
            admin_alert('Error on USSD test integration : ' + error + '\nAccount number: ' + response, "ERROR, ERROR, ERROR", 'marisa')
            stopRules();
        }
    }
});

chickenServices.registerHandlers();
transactionHistory.registerHandlers();
avocadoTreesOrdering.registerHandlers();

addInputHandler('nonClientMenu_splash', function(input){
    if(input == 1){
        marketAccess.start('rw',lang);
    }else{
        sayText(msgs('nonClientMenu',{},lang));
        promptDigits('nonClientMenu_splash', {
            'submitOnHash': false,
            'maxDigits': 2,
            'timeout': timeout_length
        });

    }
});

addInputHandler('cor_menu_select', function (input) {
    var get_menu_option = require('./lib/get-menu-option');
    notifyELK();
    input = String(input.replace(/\D/g, ''));

    // If comming from entering the group id reinitialize the input from the main menu
    if (state.vars.current_step == 'entered_glvv') {
        input = state.vars.selected_core_input;
    }
    state.vars.current_step = 'cor_menu_select';

    if (state.vars.multiple_input_menus) {
        if (input == 44 && state.vars.input_menu_loc > 0) {
            state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
            state.vars.current_menu_str = menu;
            sayText(menu);
            promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
        else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
            state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc]
            state.vars.current_menu_str = menu;
            sayText(menu);
            promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
        else if (input == 44 && state.vars.input_menu_loc == 0) {
            sayText(msgs('invalid_input', {}, lang));
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
    }

    var selection = get_menu_option(input, state.vars.splash);
    state.vars.selected_core_input = input;
    
    if (selection === null || selection === undefined) {
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        return null;
    }
    else if(selection === 'cor_get_repayments'){
        transactionHistory.start(state.vars.account_number,'rw',state.vars.current_menu_str,'cor_menu_select');            
    }
    else if(selection === 'cor_market_access'){
        try{
            marketAccess.start('rw', lang, JSON.parse(state.vars.client_json));
        }catch(e){
            var slack = require('../slack-logger/index');
            slack.log(e);
        }
    }
    else if (selection === 'cor_get_balance') { //inelegant
        var get_balance = require('./lib/cor-get-balance');
        var balance_data = get_balance(JSON.parse(state.vars.client_json), lang);
        console.log(">>>>> balance reached" + JSON.stringify(balance_data));
        if(balance_data['$PAID'] > balance_data['$CREDIT']){
            balance_data['$OVERPAID'] = parseInt(balance_data['$PAID']) - parseInt(balance_data['$CREDIT']);
            sayText(msgs('cor_get_balance_overpaid', balance_data, lang));
        }
        else{
            sayText(msgs('cor_get_balance', balance_data, lang));
        }
        promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        return null;
    }
    else if (selection === 'cor_get_payg') {
        var payg_retrieve = require('./lib/cor-payg-retrieve');
            // if account matches a serial number, give the client the corresponding PAYG code
        if (payg_retrieve(state.vars.account_number)) {
            sayText(msgs('cor_payg_true', { '$PAYG': state.vars.payg_code }, lang));
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
        // else prompt the client to enter their product's serial number
        else if (state.vars.acc_empty) {
            sayText(msgs('cor_payg_false', {}, lang));
            promptDigits('cor_payg_reg', { 'submitOnHash': false, 'maxDigits': max_digits_for_account_number, 'timeout': timeout_length });
            return null;
        }
        // print an error message if an error occurs
        else {
            sayText(msgs('cor_payg_duplicate', {}, lang));
            promptDigits('cor_payg_reg', { 'submitOnHash': false, 'maxDigits': max_digits_for_account_number, 'timeout': timeout_length });
            return null;
        }
    }
    else if(selection === 'chicken_confirm'){
        try {
            chickenServices.start(state.vars.account_number,'rw');            
        } catch (error) {
            var slack = require('../slack-logger/index');
            slack.log(error)
        }
    }
    else if (selection === 'chx_confirm') {
        // if they have already ordered chickens, tell them how many they have ordered and ask if they'd like to change
        state.vars.chx_order = require('./lib/chx-check-order')(state.vars.account_number);
        if (state.vars.chx_order) {
            // code for changing order
            sayText(msgs('chx_change_order', { '$NAME': state.vars.client_name, '$ORDER': state.vars.chx_order }, lang));
            promptDigits('chx_update', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else {
            // check how many chickens the client is eligible for
            var eligibility_check = require('./lib/chx-check-eligibility');
            state.vars.max_chx = eligibility_check(JSON.parse(state.vars.client_json));
            // depending on the eligibility, either prompt them to order or tell them they're not eligible and exit
            if (state.vars.max_chx === 0) {
                sayText(msgs('chx_not_eligible', {}, lang));
                return null;
            }
            else {
                sayText(msgs('chx_order_message', { '$NAME': state.vars.client_name, '$CHX_NUM': state.vars.max_chx }));
                promptDigits('chx_place_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
        }
    }
    else if (selection === 'cor_mm_locator') {// based on client's site and district, display a list of phone numbers near them
        var geo_select = require('./lib/cta-geo-select');
        var geo_mm_data = require('./dat/mm-agent-geography');
        // translate variables into indices
        var district = Object.keys(geo_mm_data).indexOf(state.vars.client_district);
        var site = Object.keys(geo_select(district, geo_mm_data)).indexOf(state.vars.client_site);
        // generate list of agents within client's sites
        var geo_data = geo_select(site, geo_select(district, geo_mm_data));
        var k = Object.keys(geo_data);
        var agent_display = '';
        for (i = 1; i < k.length + 1; i++) {
            agent_display = agent_display + i + ') ' + k[i - 1] + '\n';
        }
        state.vars.current_menu = JSON.stringify(agent_display);
        // display menu of agent phone numbers
        sayText(msgs('mml_display_agents', { '$GEO_MENU': agent_display }));
        promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
        // send the client an SMS with the phone numbers of MM agents in their site
        var agent_record = msgs('mml_display_agents', { '$GEO_MENU': agent_display }, lang);
        var msg_route = project.vars.sms_push_route;
        project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': agent_record });
    }
    else if (selection === 'enr_order_start') {
        state.vars.multiple_input_menus = 1;
        var client = get_client(state.vars.account_number, an_pool, true);
        if (client === null || client.vars.registered == 0) {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
        }
        if (client.vars.finalized == 1) { //fix next tine for generallity
            sayText(msgs('enr_order_already_finalized', {}, lang));
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if (client.vars.registered == 1) {
            // if client does not have a glvv id entered, prompt them to enter it before continuing
            var glvv_check = client.vars.glus || state.vars.glus;
            if (glvv_check == null || glvv_check == 0) {
                sayText(msgs('enr_missing_glvv', {}, lang));
                promptDigits('enr_glvv_id', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
                return null;
            }
            // save glvv in client row
            client.vars.glus = state.vars.glus;
            client.save();
            // check if client is a group leader
            var gl_check = require('./lib/enr-group-leader-check');
            var is_gl = gl_check(state.vars.account_number, state.vars.glus, an_pool, glus_pool);
            // continue with order steps
            state.vars.session_authorized = true;
            state.vars.session_account_number = state.vars.account_number;
            state.vars.client_geo = client.vars.geo;
            //var prod_menu_select = require('./lib/enr-select-product-menu');
            //var product_menu_table_name = prod_menu_select(state.vars.client_geo, geo_menu_map);
            var product_menu_table_name = service.vars.input21ATable;
            state.vars.product_menu_table_name = product_menu_table_name;
            var populate_district_inputs_menu = require('./lib/populate-input-menu-by-district');
            var menu = populate_district_inputs_menu(lang);
            if (typeof (menu) == 'string') {
                state.vars.current_menu_str = menu;
                sayText(menu);
                state.vars.multiple_input_menus = 0;
                state.vars.input_menu = menu;
                promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else if (typeof (menu) == 'object') {
                state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
                state.vars.multiple_input_menus = 1;
                state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
                state.vars.current_menu_str = menu[state.vars.input_menu_loc];
                sayText(menu[state.vars.input_menu_loc]);
                state.vars.input_menu = JSON.stringify(menu);
                promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
        }
        else {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
        }
    }
    else if (selection === 'enr_order_review_start') {
        var client = get_client(state.vars.account_number, an_pool,true);
        if (client === null || client.vars.registered === 0) {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else {
            var prod_menu_select = require('./lib/enr-select-product-menu');
            var gen_input_review = require('./lib/enr-gen-order-review'); //todo: add prepayment calc
            var input_review_menu = gen_input_review(state.vars.account_number, service.vars.input21ATable, an_pool, lang);
            if(input_review_menu == null){
                var review_msg = msgs('no_produts_msg',{},lang);
                sayText(review_msg);
                promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else if (typeof (input_review_menu) == 'string') {
                sayText(input_review_menu);
                state.vars.multiple_review_menus = 0;
                state.vars.review_menu = input_review_menu;
                promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else {
                state.vars.multiple_review_menus = 1;
                state.vars.review_menu_loc = 0;
                state.vars.review_menu_length= Object.keys(input_review_menu).length;
                state.vars.current_review_str = input_review_menu[state.vars.review_menu_loc];
                sayText(state.vars.current_review_str);
                state.vars.review_menu = JSON.stringify(input_review_menu);
                promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
        }
    }
    else if (selection === 'enr_finalize_start') {
        var client = get_client(state.vars.account_number, an_pool);
        if (client == null || client.vars.registered == 0) {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits(state.vars.current_step, { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if (client.vars.finalized !== 1 || client.vars.finalized === undefined) {
            state.vars.session_account_number = state.vars.account_number;
            sayText(msgs('ENR_FINALIZE_TERMS_AND_CONDITION',{},lang));
            promptDigits('enr_terms_and_conditions', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            
        }
        else if (client.vars.finalized == 1) {
            sayText(msgs('enr_already_finalized', {}, lang));
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
    } else if(selection == 'view_group_repayment' && state.vars.isGroupLeader) {
        groupRepaymentsModule.startGroupRepayments({lang: lang});
    }
    else if(selection == 'avocado_trees_ordering') {
        avocadoTreesOrdering.start(state.vars.account_number,'rw',lang);
    }
    else {
        var current_menu = msgs(selection, {}, lang);
        state.vars.current_menu_str = current_menu;
        sayText(current_menu);
        promptDigits(selection, { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        return null;
    }
});

groupRepaymentsModule.registerGroupRepaymentHandlers({lang: lang, main_menu: state.vars.current_menu_str, main_menu_handler: 'cor_menu_select'});

// If the number of persons in a group is more than 30 ask them to try again
addInputHandler('market_people_in_group', function(input){
    notifyELK();

    if(input > 0 && input <= 30){
        var menu = msgs('maize_number',{},lang);
        state.vars.current_menu = menu;
        state.vars.number_of_farmers = input;
        sayText(menu);
        promptDigits('harvest_amount_handler', { 'submitOnHash': false, 'maxDigits': 10, 'timeout': timeout_length });
    }
    else{
        var menu = msgs('market_persons_in_group',{},lang);
        sayText(msgs('invalid_try_again', {'$Menu':menu}, lang));
        promptDigits('market_people_in_group', { 'submitOnHash': false, 'maxDigits': 2, 'timeout': timeout_length });
    }
}),

addInputHandler('harvest_amount_handler', function(amount){
    notifyELK();
    var amount = String(amount.replace(/\D/g, ''));
    if(parseInt(amount) < 0 || parseInt(amount) > 1000000){
        var menu = msgs('crop_amount_menu',{},lang);
        sayText(msgs('invalid_try_again', {'$Menu':menu}, lang));
        promptDigits('harvest_amount_handler', { 'submitOnHash': false, 'maxDigits': 10, 'timeout': timeout_length });
    }
    else{
        if(lang=='en'){state.vars.crop_type = 'Unshelled maize'}else{state.vars.crop_type = 'Ibigori bidahunguye ( Bikiri ku mahundo)'};
        state.vars.harvest_amount = amount;
        var timing = '';
        if(lang == 'ki'){timing = '1) Ubu birumye neza\n2) Nyuma y icyumeru\n3) Mu byumweru bibiri\n4) Hejuru y ibumweru bibiri'}
        else{timing = '1)Now\n2) Next week\n3) In two weeks\n4) In more than 2 weeks'}
        sayText(msgs('harvest_timing_menu',{'$HarvestTime':timing},lang));
        promptDigits('harvest_timing_handler', { 'submitOnHash': false, 'maxDigits': 9, 'timeout': timeout_length });

    }

});

addInputHandler('harvest_timing_handler', function(input){
    notifyELK();
    input = String(input.replace(/\D/g, ''));
    if(input == 1 ){if(lang == 'ki'){state.vars.harvest_time = 'Ubu birumye neza'}else{state.vars.crop_tye ='Now'}}
    else if(input == 2 ){if(lang == 'ki'){state.vars.harvest_time = 'Nyuma y icyumeru'}else{state.vars.crop_tye ='Next week'}}
    else if(input == 3 ){if(lang == 'ki'){state.vars.harvest_time = 'Mu byumweru bibiri'}else{state.vars.crop_tye ='In two weeks'}}
    else if(input == 4 ){if(lang == 'ki'){state.vars.harvest_time = 'Hejuru y ibumweru bibiri'}else{state.vars.crop_tye ='In more than 2 weeks'}}
    else{
        var timing = '';
        if(lang == 'ki'){timing = '1) Ubu birumye neza\n2) Nyuma y icyumeru\n3) Mu byumweru bibiri\n4) Hejuru y ibumweru bibiri'}
        else{timing = '1)Now\n2) Next week\n3) In two weeks\n4) In more than 2 weeks'}
        var menu = msgs('harvest_timing_menu',{'$HarvestTime':timing},lang);
        sayText(msgs('invalid_try_again', {'$Menu':menu}, lang));
        promptDigits('harvest_timing_handler', { 'submitOnHash': false, 'maxDigits': 9, 'timeout': timeout_length });
        stopRules();
        return;
    }
    var menu ='';
    menu = msgs('market_access_confirmation_menu',{'$Amount':state.vars.harvest_amount,'$Timeline':state.vars.harvest_time},lang);
    sayText(menu);
    promptDigits('m_market_confirm_handler', { 'submitOnHash': false, 'maxDigits': 9, 'timeout': timeout_length });
});

addInputHandler('m_market_confirm_handler', function(input){
    notifyELK();
    input = String(input.replace(/\D/g, '')); 
    if(input == 0){
        var groupsTable = project.initDataTableById(service.vars.groupCodes_id);
        var cursor = client_table.queryRows({ 'vars': { 'account_number': state.vars.account_number}});
        
        if(cursor.hasNext()){
            var row = cursor.next();
            state.vars.groupCodeForGL = row.vars.glus;
        }
        var cursor = groupsTable.queryRows({vars:{'group_code':state.vars.groupCodeForGL}});
        if(cursor.hasNext())
        {
            var row = cursor.next();
            var district = row.vars.district;
            var site = row.vars.site;
            var group = row.vars.group;
        }
        var table = project.initDataTableById(service.vars.market_access_table_id);
        var row = table.createRow({ 
            vars: {'district': district, 'site': site, 'group': group, 'account_number': state.vars.account_number, 'product': state.vars.crop_type, "amount" : state.vars.harvest_amount, "date_available" : state.vars.harvest_time, "farmers_number":state.vars.number_of_farmers}
        });
        row.save();
        sayText(msgs('market_access_final_message'),{},lang);
        promptDigits('backToMain',{'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length })
    }
    else{
        var menu ='';
        menu = msgs('market_access_confirmation_menu',{'$Amount':state.vars.harvest_amount, '$Timeline':state.vars.harvest_time},lang);
        sayText(msgs('invalid_try_again', {'$Menu':menu}, lang));
        promptDigits('m_market_confirm_handler', { 'submitOnHash': false, 'maxDigits': 9, 'timeout': timeout_length });
    }

});

addInputHandler('backToMain', function(input){
    notifyELK();
    var splash = account_splash_menu_name;
    state.vars.splash = splash;
    var menu = populate_menu(splash, lang);
    if (typeof (menu) == 'string') {
        state.vars.current_menu_str = menu;
        sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        state.vars.current_menu_str = menu[state.vars.input_menu_loc];
        sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }

});


addInputHandler('chx_update', function (input) {
    notifyELK();
    input = parseInt(input.replace(/\D/g, ''));
    // if they want to update, ask them to place an order
    if (input === 1) {
        // check how many chickens the client is eligible for
        var eligibility_check = require('./lib/chx-check-eligibility');
        state.vars.max_chx = eligibility_check(JSON.parse(state.vars.client_json));
        // depending on the eligibility, either prompt them to order or tell them they're not eligible and exit
        if (state.vars.max_chx === 0) {
            sayText(msgs('chx_not_eligible', {}, lang));
            return null;
        }
        else {
            sayText(msgs('chx_order_message', { '$NAME': state.vars.client_name, '$CHX_NUM': state.vars.max_chx }));
            promptDigits('chx_place_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
    }
    else {
        // return client to main menu
        var menu = populate_menu(state.vars.splash, lang);
        sayText(menu, lang);
        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });

    }
})

addInputHandler('chx_place_order', function (input) {
    notifyELK();
    input = parseInt(input.replace(/\D/g, ''));
    state.vars.chx_order = input;
    // veto if client has entered an invalid chicken order; otherwise ask them to confirm
    if (input >= 2 && input <= state.vars.max_chx) {
        var chx_cost = 2400; // abstract
        var credit = input * chx_cost;
        sayText(msgs('chx_confirm_order', { '$ORDER': input, '$CREDIT': credit }, lang));
        promptDigits('chx_confirm_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
    else {
        // modify message depending on the order
        if (state.vars.max_chx === 2) {
            var invalid_msg = 'chx_invalid_order_opt2';
        }
        else {
            var invalid_msg = 'chx_invalid_order';
        }
        sayText(msgs(invalid_msg, { '$CHX_NUM': state.vars.max_chx }, lang));
        promptDigits('chx_place_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
});

addInputHandler('chx_confirm_order', function (input) {
    notifyELK();
    var admin_alert = require('./lib/admin-alert'); //global admin alerter
    input = parseInt(input.replace(/\D/g, ''));
    if (input === 1) {
        // save the confirmed order in the data table
        var chx_table = project.getOrCreateDataTable('20b_chicken_table');
        var chx_cursor = chx_table.queryRows({ 'vars': { 'account_number': state.vars.account_number } });
        if (chx_cursor.hasNext()) {
            chx_row = chx_cursor.next();
            if (chx_cursor.hasNext()) {
                admin_alert('Duplicate AN in chx db ' + state.vars.account_number);
            }
            chx_row.vars.ordered_chickens = state.vars.chx_order;
            chx_row.save();
            // send SMS to client with confirmation code
            var conf_code = chx_row.vars.confirmation_code;
            sayText(msgs('chx_order_finalized', { '$ORDER': state.vars.chx_order, '$VOUCHER': conf_code }, lang));
            var conf_msg = msgs('chx_confirmation_sms', { '$ORDER': state.vars.chx_order, '$VOUCHER': conf_code }, lang);
            var msg_route = project.vars.sms_push_route;
            project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': conf_msg });
        }
        else {
            admin_alert('Account number ' + state.vars.account_number + ' not found in chicken dataset');
            return null;
        }
    }
    else {
        // return client to main menu
        var menu = populate_menu(state.vars.splash, lang);
        sayText(menu, lang);
        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        return null;
    }
});

// CODE BLOCKS BELOW ARE FOR OLD CONFIRMATION SERVICE
/* addInputHandler('chx_confirm', function(input){
    input = parseInt(input.replace(/\D/g,''));
    state.vars.current_step = 'chx_confirm';
    if(input > 0 && input <= state.vars.max_chx){
        var check_chx_conf = require('./lib/chx-check-reg');
        if(check_chx_conf(state.vars.account_number, chicken_client_table)){
            sayText(msgs('chx_already_confirmed', {}, lang));
            promptDigits('cor_continue', {'submitOnHash' : false, 'maxDigits' : max_digits_for_input, 'timeout' : timeout_length});
            return null;
        }
        state.vars.confirmed_chx = input;
        sayText(msgs('chx_final_confirm', {'$CHX_NUM' : state.vars.confirmed_chx}, lang));
        promptDigits('chx_final_confirm', {'submitOnHash' : false, 'maxDigits' : max_digits_for_input, 'timeout' : timeout_length});
        return null;
    }
    else if(input > state.vars.max_chx){
        sayText(msgs('chx_too_many', {}, lang))
        promptDigits('invalid_input',{'submitOnHash' : false, 'maxDigits' : max_digits_for_input, 'timeout' : timeout_length});
        return null;
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', {'submitOnHash' : false, 'maxDigits' : max_digits_for_input, 'timeout' : timeout_length});
        return null;
    }
});
addInputHandler('chx_final_confirm', function(input){ //final confirmation to ensure that correct number of chickens is picked
    input = parseInt(input.replace(/\D/g,''));
    if(input === 1){
        var save_chx_quant = require('./lib/chx-save-quant');
        var conf_code = save_chx_quant(state.vars.account_number, state.vars.confirmed_chx, chicken_client_table);
        var conf_msg = msgs('chx_confirmed', {'$CHX_NUM' : state.vars.confirmed_chx, '$CONFIRMATION_CODE' : conf_code}, lang);
        var msg_route = project.vars.sms_push_route;
        project.sendMessage({'to_number' : contact.phone_number, 'route_id' : msg_route, 'content' : conf_msg});
        sayText(conf_msg)
        promptDigits('cor_continue', {'submitOnHash' : false, 'maxDigits' : max_digits_for_input, 'timeout' : timeout_length});
        return null;
    }
    else{
        sayText(msgs('chx_not_confirmed', {}, lang));
        promptDigits('cor_continue', {'submitOnHash' : false, 'maxDigits' : max_digits_for_input, 'timeout' : timeout_length});
        return null;
    }
}); */

/*
generic input handler for returning to main splash menu
*/
addInputHandler('cor_continue', function (input) {
    notifyELK();
    state.vars.current_step = 'cor_continue';
    input = parseInt(input.replace(/\D/g, ''));
    if (input !== 99) {
        var splash_menu = populate_menu(state.vars.splash, lang);
        var menu = splash_menu;
        if (typeof (menu) == 'string') {
            state.vars.current_menu_str = menu;
            sayText(menu);
            state.vars.multiple_input_menus = 0;
            state.vars.input_menu = menu;
            promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if (typeof (menu) == 'object') {
            state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
            state.vars.multiple_input_menus = 1;
            state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
            state.vars.current_menu_str = menu[state.vars.input_menu_loc];
            sayText(menu[state.vars.input_menu_loc]);
            state.vars.input_menu = JSON.stringify(menu);
            promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        return null;
    }
    else if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
});

/*
input handler for invalid input - input handlers dump here for unrecognized input if there's not already a loop
*/
addInputHandler('invalid_input', function (input) {
    notifyELK();
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

// input handler for registering serial number
addInputHandler('cor_payg_reg', function (serial_no) {
    notifyELK();
    //serial_no = parseInt(serial_no.replace(/\D/g,''));
    serial_no = serial_no.replace(/^0+/, '');
    console.log("Serial number is " + serial_no + " and its type is " + typeof (serial_no));
    var serial_verify = require('./lib/cor-serial-verify');
    // if the input serial is valid, give the client their PAYG code
    if (serial_verify(serial_no)) {
        sayText(msgs('cor_payg_true', { '$PAYG': state.vars.payg_code }, lang));
        promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        return null;
    }
    // else prompt them to re-enter their serial number
    else if (state.vars.serial_status) {
        sayText(msgs('cor_payg_invalid_serial', {}, lang));
        promptDigits('cor_payg_reg', { 'submitOnHash': false, 'maxDigits': max_digits_for_account_number, 'timeout': timeout_length })
        return null;
    }
    // if error occurs, print error message for the client
    else {
        sayText(msgs('cor_payg_error', {}, lang));
        return null;
    }
});


// Enrollement codes

//registration

/*
input handlers for registration steps
*/

//prompt for national Id then Show them the national id they have entered and ask for confirmation
inputHandlers['registration_start'] = function (input) {
    notifyELK();
    state.vars.current_step = 'enr_reg_start';
    input = String(input.replace(/\D/g, ''));
    var check_if_nid = require('./lib/enr-check-nid');
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        regSessionManager.clear(contact.phone_number)
        return null;
    }
    else if (!check_if_nid(input)) {
        sayText(msgs('enr_invalid_nid', {}, lang));
        promptDigits('enr_reg_start', { 'submitOnHash': false, 'maxDigits': max_digits_for_nid, 'timeout': timeout_length });
    }
    else {
        regSessionManager.save(contact.phone_number,state.vars,'registration_start',input);
        state.vars.reg_nid = input;
        var confirmation_menu = msgs('enr_confirmation_menu', {}, lang);
        var current_menu = msgs('enr_nid_client_confirmation', { '$ENR_NID_CONFIRM': input, '$ENR_CONFIRMATION_MENU': confirmation_menu }, lang);
        state.vars.current_menu_str = current_menu;
        sayText(current_menu);
        promptDigits('enr_nid_client_confirmation', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
};

addInputHandler('enr_reg_start', inputHandlers['registration_start']);

// Checking confirmation from the user
addInputHandler('enr_nid_client_confirmation', function (input) {
    notifyELK();
    if(input == '33'){
        var current_menu = msgs('enr_reg_start', {}, lang);
        state.vars.current_menu_str = current_menu;
        sayText(current_menu);
        promptDigits('enr_reg_start', { 'submitOnHash': false, 'maxDigits': max_digits_for_nid, 'timeout': timeout_length });
        return;
    }
    state.vars.current_step = 'enr_nid_client_confirmation';
    input = String(input.replace(/\D/g, ''));
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        regSessionManager.clear(contact.phone_number);
        return null;
    }

    // If the user does not confirm(chooses no)
    else if (input == 2) {
        regSessionManager.clear(contact.phone_number);
        var current_menu = msgs('enr_reg_start', {}, lang);
        state.vars.current_menu_str = current_menu; // set the current menu to what the user choosed(yes/no)
        sayText(current_menu);
        promptDigits('enr_reg_start', { 'submitOnHash': false, 'maxDigits': max_digits_for_nid, 'timeout': timeout_length });
    }
    //If the user confirms (chooses yes)
    else if (input == 1) {
        // Check if the client is already registered 
        // TODO Add this handler to the resume checkpoint with this input
        var is_already_reg = require('./lib/enr-check-dup-nid');
        if (is_already_reg(state.vars.reg_nid, an_pool)) {
            regSessionManager.clear(contact.phone_number);
            var get_client_by_nid = require('./lib/dpm-get-client-by-nid');
            var client = get_client_by_nid(state.vars.reg_nid, an_pool);
            var enr_msg = msgs('enr_reg_complete_msg', { '$ACCOUNT_NUMBER': client.account_number, '$NAME': client.name1 + ' ' + client.name2 }, lang)
            sayText(enr_msg);
            var enr_msg_sms = msgs('enr_reg_complete_sms', { '$ACCOUNT_NUMBER': client.account_number, '$NAME': client.name1 + ' ' + client.name2 }, lang);
            var messager = require('./lib/enr-messager');
            messager(contact.phone_number, enr_msg_sms);
            if (state.vars.reg_pn) {
                messager(state.vars.reg_pn, enr_msg_sms);
            }
            //Get client data from Roster so that all the client's data are available then redirect to the menu
            try {
                var verify = require('./lib/account-verify')
                var client_verified = verify(client.account_number);
                if (client_verified) {
                    var isDistrictClosed = require('./lib/isDistrictClosed');
                    if(isDistrictClosed(state.vars.client_districtId)){
                        sayText(msgs('enrollment_ended', {}, lang));
                        return;
                    }
                    sayText(msgs('account_number_verified'));
                    state.vars.account_number = client.account_number;
                    var splash = account_splash_menu_name;
                    if (splash === null || splash === undefined) {
                        admin_alert(state.vars.client_district + ' not found in district database');
                        throw 'ERROR : DISTRICT NOT FOUND';
                    }
                    state.vars.splash = splash;
                    var menu = populate_menu(splash, lang);
                    if (typeof (menu) == 'string') {
                        state.vars.current_menu_str = menu;
                        sayText(menu);
                        state.vars.multiple_input_menus = 0;
                        state.vars.input_menu = menu;
                        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
                    }
                    else if (typeof (menu) == 'object') {
                        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
                        state.vars.multiple_input_menus = 1;
                        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
                        state.vars.current_menu_str = menu[state.vars.input_menu_loc];
                        sayText(menu[state.vars.input_menu_loc]);
                        state.vars.input_menu = JSON.stringify(menu);
                        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
                    }
                }
                else {
                    sayText(msgs('account_number_not_found'));
                }
            }
            catch (error) {
                console.log(error);
                admin_alert('Error on USSD test integration : ' + error + '\nAccount number: ' + response, "ERROR, ERROR, ERROR", 'marisa')
                stopRules();
            }
        }
        // start registration process by asking them to enter their id again
        else {
            sayText(msgs('enr_name_1', {}, lang));
            promptDigits('enr_name_1', { 'submitOnHash': false, 'maxDigits': max_digits_for_name, 'timeout': timeout_length });    
        }
    }
    else {
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }


});



inputHandlers['name1InputHandler'] = function (input) {
    notifyELK();
    if(input == '33'){
        var confirmation_menu = msgs('enr_confirmation_menu', {}, lang);
        var current_menu = msgs('enr_nid_client_confirmation', { '$ENR_NID_CONFIRM':  state.vars.reg_nid, '$ENR_CONFIRMATION_MENU': confirmation_menu }, lang);
        state.vars.current_menu_str = current_menu;
        sayText(current_menu);
        promptDigits('enr_nid_client_confirmation', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        return;
    }
    input = input.replace(/[^a-zA-Z]/gi, '');
    state.vars.current_step = 'enr_name_1';
    if (input == 99) {
        regSessionManager.clear(contact.phone_number);
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    input = input.replace(/[^a-z_]/ig, '');
    if (contact.phone_number == '5550123') { // allows for testing on the online testing env
        input = 'TestFirstName';
    }
    if (input === undefined || input == '') {
        sayText(msgs('enr_invalid_name_input', {}, lang));
        promptDigits('enr_name_1', { 'submitOnHash': false, 'maxDigits': max_digits_for_name, 'timeout': timeout_length });
    }
    else {
        regSessionManager.save(contact.phone_number, state.vars, 'name1InputHandler', input);
        state.vars.reg_name_1 = input;
        sayText(msgs('enr_name_2', {}, lang));
        promptDigits('enr_name_2', { 'submitOnHash': false, 'maxDigits': max_digits_for_name, 'timeout': timeout_length });
    }
};
addInputHandler('enr_name_1', inputHandlers['name1InputHandler']);

inputHandlers['name2InputHandler'] = function (input) {
    input = input.replace(/[^a-zA-Z0-9]/gi, '');
    notifyELK();
    if(input == '33'){
        sayText(msgs('enr_name_1', {}, lang));
        promptDigits('enr_name_1', { 'submitOnHash': false, 'maxDigits': max_digits_for_name, 'timeout': timeout_length });
        return;
    }
    state.vars.current_step = 'enr_name_2';
    if (input == 99) {
        regSessionManager.clear(contact.phone_number);
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    input = input.replace(/[^a-zA-Z0-9_]/ig, '');
    if (contact.phone_number == '5550123') { // allows for testing on the online testing env
        input = 'TestSecondName';
    }
    input = input ? input : 'XXXXXXX';

    regSessionManager.save(contact.phone_number, state.vars, 'name2InputHandler', input);
    state.vars.reg_name_2 = input;
    sayText(msgs('enr_pn', {}, lang));
    promptDigits('enr_pn', { 'submitOnHash': false, 'maxDigits': max_digits_for_pn, 'timeout': timeout_length });
};
addInputHandler('enr_name_2', inputHandlers['name2InputHandler']);

inputHandlers['phoneInputHandler'] = function (input) {
    notifyELK();
    if(input == '33'){
        sayText(msgs('enr_name_2', {}, lang));
        promptDigits('enr_name_2', { 'submitOnHash': false, 'maxDigits': max_digits_for_name, 'timeout': timeout_length });
        return;
    }
    state.vars.current_step = 'enr_pn';
    input = input.replace(/\D/g, '');
    var check_pn = require('./lib/phone-format-check');
    if (input == 99) {
        regSessionManager.clear(contact.phone_number);
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    if (check_pn(input)) {
        state.vars.reg_pn = input;
        regSessionManager.save(contact.phone_number, state.vars, 'phoneInputHandler', input);
        sayText(msgs('enr_glus', {}, lang));
        promptDigits('enr_glus', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
    }
    else {
        sayText(msgs('invalid_pn_format', {}, lang));
        promptDigits('enr_pn', { 'submitOnHash': false, 'maxDigits': max_digits_for_pn, 'timeout': timeout_length });
    }
};
addInputHandler('enr_pn', inputHandlers['phoneInputHandler']);

inputHandlers['groupCodeInputHandler'] = function (input) {
    notifyELK();
    //input = input.replace(/\W/g, '');
    if(input == '33'){
        sayText(msgs('enr_pn', {}, lang));
        promptDigits('enr_pn', { 'submitOnHash': false, 'maxDigits': max_digits_for_pn, 'timeout': timeout_length });
        return;
    }
    state.vars.current_step = 'enr_glus';
    if (input == 99) {
        regSessionManager.clear(contact.phone_number);
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else {

        input = input.replace(/[^0-9]/g, '*');
        // If the user forget the leading zero
        if(input.replace(/[^0-9]/g, '').length != 13){
            input = '0'+ input;
        }
        state.vars.glus = input;
        // checking and retreiving info about the entered id
        var groupCheck = require('./lib/enr-check-gid');
        var group_information = groupCheck(input, service.vars.groupCodeTableId);
        if(group_information == false){
            sayText(msgs('invalid_group_id',{},lang));
            sayText(msgs('enr_glus', {}, lang));
            promptDigits('enr_glus', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });

        }
        // if the info about the id is not null, ask for confirmation with the group info
        else if (group_information) {
            group_information = JSON.parse(group_information);
            var confirmation_menu = msgs('enr_confirmation_menu',{},lang);
            var current_menu = msgs('enr_group_id_confirmation',
             {
                '$ENR_GROUP_ID' : input,
                '$ENR_CONFIRMATION_MENU' : confirmation_menu,
                '$NAME': group_information.name
            }, lang);
            state.vars.current_menu_str = current_menu;
            sayText(current_menu);
            promptDigits('reg_group_code_confirmation', {'submitOnHash' : false, 'maxDigits' : max_digits_for_input,'timeout' : timeout_length});
        }
        // if the group id is not valid, prompt them again
        else {
            sayText(msgs('invalid_group_id',{},lang));
            sayText(msgs('enr_glus', {}, lang));
            promptDigits('enr_glus', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
        }
    }
};
addInputHandler('reg_group_code_confirmation', function(input) {
    if(input == '1') {
        // continue
        var group_size_satisfied = require('./lib/core-group-size-check');
        // Check if the group size is less than 16 or not found in the table
        if (!group_size_satisfied(state.vars.glus, client_table)){
            sayText(msgs('group_size_not_satisfied',{},lang));
            regSessionManager.clear(contact.phone_number);
            stopRules();
            return null;
        } else {   
            regSessionManager.save(contact.phone_number, state.vars, 'groupCodeInputHandler', input);
            var current_menu = msgs('are_you_a_gl',{},lang);
            state.vars.current_menu_str = current_menu;
            sayText(current_menu);
            promptDigits('enrl_ask_glus',{ 'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
        }
    } else {
        // reprompt for group code
        sayText(msgs('invalid_group_id',{},lang));
        sayText(msgs('enr_glus', {}, lang));
        promptDigits('enr_glus', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
    }
});
addInputHandler('enr_glus', inputHandlers['groupCodeInputHandler']);

inputHandlers['areYouGroupLeader'] = function(input) {
    if(input == 1 || input == 2) {
        // has responded is a group leader
        regSessionManager.save(contact.phone_number, state.vars, 'areYouGroupLeader', input);
        var current_menu = msgs('enr-group-constitution-approvement',{},lang);
        state.vars.current_menu_str = current_menu;
        state.vars.areYouGL = input == 1 ? 'YES' : 'NO';
        sayText(current_menu);
        promptDigits('reg_group_constitution_confirm',{ 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    } else {
        // reprompt for group leader
        var current_menu = msgs('are_you_a_gl',{},lang);
        state.vars.current_menu_str = current_menu;
        sayText(state.vars.current_menu_str);
        promptDigits('enrl_ask_glus',{ 'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
    }
}

addInputHandler('enrl_ask_glus', inputHandlers['areYouGroupLeader'])


//not currenty active
addInputHandler('enr_group_id_confirmation', function (input) { //enr group leader / umudugudu support id step. last registration step
    notifyELK();
    if(input == '33'){
        sayText(msgs('enr_glus', {}, lang));
        promptDigits('enr_glus', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
        return;
    }
    state.vars.current_step = 'enr_glus';
    input = input.replace(/\W/g, '');
    if (input == 99) {
        regSessionManager.clear(contact.phone_number);
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    state.vars.confirmation = input;
    if (input == 2) { // if the user chooses no, they will be prompt to enter the group code again
        var current_menu = msgs('enr_glus', {}, lang);
        state.vars.current_menu_str = current_menu;
        sayText(current_menu);
        promptDigits('enr_glus', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });

    }
    else if (input == 1) { // if the user chooses yes, that the id is correct, save the info
        sayText(msgs('enr-group-constitution-approvement',{},lang));
        promptDigits('reg_group_constitution_confirm',{ 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
    else {// If there is an invalid input(not one or two)
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });

    }
});//end registration steps input handlers

addInputHandler('reg_group_constitution_confirm',function(input){
    notifyELK();
    if(input == '33'){
        sayText(msgs('enr_glus', {}, lang));
        promptDigits('enr_glus', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
        return;
    }
    input = input.replace(/\W/g, '');
    if (input == 99) {        
        regSessionManager.clear(contact.phone_number);
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else if (input == 1) { // if the user chooses yes, that the id is correct, save the info
        var geo = state.vars.districtName;
        // if there isn't already an account number, get one
        var client_log_result ={};
        if (state.vars.account_number == null) {
            var client_log = require('./lib/enr-client-logger');
            client_log_result = client_log(state.vars.reg_nid, state.vars.reg_name_1, state.vars.reg_name_2, state.vars.reg_pn, state.vars.glus, geo, an_pool, state.vars.areYouGL, lang);
            if(client_log_result === null){
                stopRules();
                return null;
            }
        }
        if(client_log_result != null){
            regSessionManager.clear(contact.phone_number);
            //check if group leader here
            var gl_check = require('./lib/enr-group-leader-check');
            var is_gl = gl_check(state.vars.account_number, state.vars.glus, an_pool, glus_pool);
            console.log('is gl? : ' + is_gl);
            var enr_msg = msgs('enr_reg_complete', { '$ACCOUNT_NUMBER': state.vars.account_number, '$NAME': state.vars.reg_name_2 }, lang);
            sayText(enr_msg);
            promptDigits('reg_end_ordering_redirect', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            //retreive ads per district entered by the user
            var retrieveAd = require('./lib/enr-retrieve-ad-by-district');
            var districtId = state.vars.districtId;
            var sms_ad = retrieveAd(districtId, lang) || ' ';
            var enr_msg_sms = msgs('enr_reg_complete_sms', { '$ACCOUNT_NUMBER': state.vars.account_number, '$NAME': state.vars.reg_name_2, '$AD_MESSAGE': sms_ad }, lang);
            var messager = require('./lib/enr-messager');
            messager(contact.phone_number, enr_msg_sms);
            messager(state.vars.reg_pn, enr_msg_sms);               
        }       
    }
    else {
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }

});

addInputHandler('reg_end_ordering_redirect',function(input){
    notifyELK();
    input = input.replace(/\W/g, '');
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else if(input == 1){
        
        state.vars.multiple_input_menus = 1;
        var client = get_client(state.vars.account_number, an_pool, true);
        var isDistrictClosed = require('./lib/isDistrictClosed');
        if (client === null || client.vars.registered == 0) {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
        }
        state.vars.client_districtId = state.vars.districtId;
        if (client.vars.finalized == 1) { //fix next tine for generallity
            sayText(msgs('enr_order_already_finalized', {}, lang));
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if(isDistrictClosed(state.vars.client_districtId)){
            sayText(msgs('enrollment_ended', {}, lang));
            stopRules();
        }
        else if (client.vars.registered == 1) {
            // if client does not have a glvv id entered, prompt them to enter it before continuing
            glvv_check = client.vars.glus || state.vars.glus;
            if (glvv_check == null || glvv_check == 0) {
                sayText(msgs('enr_missing_glvv', {}, lang));
                promptDigits('enr_glvv_id', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
                return null;
            }
            // save glvv in client row
            client.vars.glus = state.vars.glus;
            client.save();
            // check if client is a group leader
            var gl_check = require('./lib/enr-group-leader-check');
            var is_gl = gl_check(state.vars.account_number, state.vars.glus, an_pool, glus_pool);
            // continue with order steps
            state.vars.session_authorized = true;
            state.vars.session_account_number = state.vars.account_number;
            state.vars.client_geo = client.vars.geo;
            //var prod_menu_select = require('./lib/enr-select-product-menu');
            //var product_menu_table_name = prod_menu_select(state.vars.client_geo, geo_menu_map);
            var product_menu_table_name = service.vars.input21ATable;
            state.vars.product_menu_table_name = product_menu_table_name;
            var populate_district_inputs_menu = require('./lib/populate-input-menu-by-district');
            var menu = populate_district_inputs_menu(lang);
            if (typeof (menu) == 'string') {
                state.vars.current_menu_str = menu;
                sayText(menu);
                state.vars.multiple_input_menus = 0;
                state.vars.input_menu = menu;
                promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else if (typeof (menu) == 'object') {
                state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
                state.vars.multiple_input_menus = 1;
                state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
                state.vars.current_menu_str = menu[state.vars.input_menu_loc];
                sayText(menu[state.vars.input_menu_loc]);
                state.vars.input_menu = JSON.stringify(menu);
                promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
        }
        else {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
        }
    }
    else{
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }

});

// input handler for entering glvv id. note, do we want to check if this matches the client's district?
//Called when the user ordering does not have a group id
addInputHandler('enr_glvv_id', function (input) {
    notifyELK();
    state.vars.current_step = 'entered_glvv';
    
    input = input.replace(/[^0-9]/g, '*');
    if(input.replace(/[^0-9]/g, '').length != 13){
        input = '0'+ input;
    }
    // check if glvv is valid
    //var check_glus = require('./lib/enr-check-glus');
    var groupCheck = require('./lib/enr-check-gid');
    state.vars.group_information = groupCheck(input,service.vars.groupCodeTableId);
    if(state.vars.group_information == false){
        sayText(msgs('invalid_group_id',{},lang));
        sayText(msgs('enr_glus', {}, lang));
        promptDigits('enr_glvv_id', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
    }
    else if (state.vars.group_information != null) {
        var group_size_satisfied = require('./lib/core-group-size-check');
        // Check if the group size is less than 16
        if (!group_size_satisfied(input,client_table)){
            sayText(msgs('group_size_not_satisfied',{},lang));
            stopRules();
            return null;
        }
        else{
            sayText(msgs('enr-group-constitution-approvement',{},lang));
            promptDigits('group_constitution_handler', { 'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
            return null;
        }
    }
    // if the group id is not valid, prompt them again
    else {
        sayText(msgs('invalid_group_id',{},lang));
        sayText(msgs('enr_glus', {}, lang));
        promptDigits('enr_glvv_id', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
    }

});

//not currently in use
addInputHandler('enr_glvv_id_confirmation', function (input) {
    notifyELK();
    input = input.replace(/\W/g, '');
    if (input == 1) {
        if (state.vars.group_information != null) {
            var gl_check = require('./lib/enr-group-leader-check');
            var is_gl = gl_check(state.vars.account_number, state.vars.glus, an_pool);
            var cursor = client_table.queryRows({ vars: { 'account_number': state.vars.account_number } });
            if (cursor.hasNext()) {
                var row = cursor.next();
                row.vars.glus = state.vars.glus;
                row.save();
            }


            console.log('is gl? : ' + is_gl);
            // return to enr_order_start - give the client their account number in the message?
            sayText(msgs('enr-group-constitution-approvement'),{},lang);
            promptDigits('group_constitution_handler', { 'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
            return null;
        }
        else {
            sayText(msgs('enr_incorrect_glvv', {}, lang));
            promptDigits('enr_glvv_id', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
            return null;
        }
    }
    else {
        sayText(msgs('enr_incorrect_glvv', {}, lang));
            promptDigits('enr_glvv_id', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
            return null;
    }

});

addInputHandler('group_constitution_handler',function(input){
    notifyELK();
    input = parseInt(input.replace(/\D/g, ''));
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else if(input == 1){
        sayText(msgs('enr_continue', { '$GROUP': state.vars.glus }, lang));
        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
        return null;
    }
    else {
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }

});

//Main menu from placing an order

addInputHandler('enr_input_splash', function (input) { //main input menu
    var get_menu_option = require('./lib/get-menu-option');
    notifyELK();
    state.vars.current_step = 'enr_input_splash';
    input = parseInt(input.replace(/\D/g, ''));
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    var product_menu_table_name = state.vars.product_menu_table_name;
    if (state.vars.multiple_input_menus) { //needs some serious cleanup here - this is messy
        if (input == 44 && state.vars.input_menu_loc > 0) {
            state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
            state.vars.current_menu_str = menu;
            sayText(menu);
            promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
            state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc]
            state.vars.current_menu_str = menu;
            sayText(menu);
            promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if (input == 44 && state.vars.input_menu_loc == 0) {
            var splash_menu = populate_menu(state.vars.splash, lang, 300);
            var menu = msgs('enr_splash', { '$ENR_SPLASH': splash_menu }, lang);
            state.vars.current_menu_str = menu;
            sayText(menu);
            promptDigits('enr_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else {
            var selection = get_menu_option(input, product_menu_table_name,state.vars.client_districtId);
            if (selection == null) {
                sayText(msgs('enr_invalid_product_selection', {}, lang))
                promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else {
                state.vars.current_product = selection;
                var get_product_options = require('./lib/enr-get-product-options')
                var product_deets = get_product_options(selection, product_menu_table_name);
                state.vars.product_deets = JSON.stringify(product_deets);
                var process_prod = require('./lib/enr-format-product-options');
                var prod_deets_for_msg = process_prod(product_deets, lang);
                var prod_message = msgs('enr_product_selected', prod_deets_for_msg, lang)
                state.vars.prod_message = prod_message;
                sayText(prod_message);
                promptDigits('enr_input_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
        }
    }
    else {
        var selection = get_menu_option(input, product_menu_table_name,state.vars.client_districtId);
        if (selection == null) {
            sayText(msgs('enr_invalid_product_selection', {}, lang))
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
        }
        else {
            state.vars.current_product = selection;
            var get_product_options = require('./lib/enr-get-product-options')
            var product_deets = get_product_options(selection, product_menu_table_name);
            state.vars.product_deets = JSON.stringify(product_deets);
            var process_prod = require('./lib/enr-format-product-options');
            var prod_deets_for_msg = process_prod(product_deets, lang);
            var prod_message = msgs('enr_product_selected', prod_deets_for_msg, lang)
            state.vars.prod_message = prod_message;
            sayText(prod_message);
            promptDigits('enr_input_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
    }
});


addInputHandler('enr_input_order', function (input) { //input ordering function
    notifyELK();
    state.vars.current_step = 'enr_input_order';
    state.vars.current_menu_str = state.vars.prod_message;
    input = parseFloat(input.replace(/[^0-9,.,,]/g, '').replace(/,/g, '.'));
    var product_deets = JSON.parse(state.vars.product_deets);
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    if (input < product_deets.min || input > product_deets.max) {
        sayText(msgs('enr_input_out_of_bounds', {'$max': product_deets.max}, lang)); //this shoud include 1 to continue 99 to quite
        promptDigits('enr_input_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
    else if(product_deets.acceptableQuantityList && product_deets.acceptableQuantityList.split(',').indexOf(String(input)) == -1){
        sayText(msgs('enr_quantity_not_in_the_list', {'$QUANTITY_LIST': product_deets.acceptableQuantityList}, lang)); 
        promptDigits('enr_input_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
    else if (input % product_deets.increment === 0) {
        var format_order_message = require('./lib/enr-format-input-message');
        state.vars.current_input_quantity = input;
        var input_confirm_opts = format_order_message(input, product_deets, lang);
        var input_confirm_msg = msgs('enr_confirm_input_order', input_confirm_opts, lang);
        state.vars.current_menu_str = input_confirm_msg;
        sayText(input_confirm_msg);
        promptDigits('enr_confirm_input_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
    else if (input % product_deets.increment !== 0) {
        sayText(msgs('enr_bad_input_increment', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
    else {
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('enr_input_order', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
});


addInputHandler('enr_confirm_input_order', function (input) { //input ordering confirmation
    notifyELK();
    state.vars.current_step = 'enr_confirm_input_order'
    input = parseInt(input.replace(/\D/g, ''));
    if (input === 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else if (input === 44) {
        if (state.vars.multiple_input_menus) {
            var menu = JSON.parse(state.vars.input_menu)[0];
        }
        else {
            var menu = state.vars.input_menu;
        }
        state.vars.current_menu_str = menu;
        sayText(menu)
        promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
    else if (input === 1) {
        var log_input_order = require('./lib/enr-log-input-order');
        var add_input_to_orders_table = require('./lib/add_input_to_orders_table');
        var product_deets = JSON.parse(state.vars.product_deets)
        console.log('product deets : ' + JSON.stringify(product_deets));
        var bundle_name = product_deets.bundle_name;
        log_input_order(state.vars.session_account_number, an_pool, bundle_name, state.vars.current_input_quantity)
        add_input_to_orders_table(state.vars.session_account_number, product_deets.bundleId, product_deets.bundleInputId, state.vars.current_input_quantity)
        sayText(msgs('enr_input_order_success', { '$NAME': product_deets[lang] }, lang));
        promptDigits('enr_input_order_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
    else {
        sayText(msgs('invalid_input', {}, lang));
        promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
});

addInputHandler('enr_input_order_continue', function (input) {
    notifyELK();
    state.vars.current_step = 'input_order_continue';
    input = parseInt(input.replace(/\D/g, ''));
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else if(input == 2){
        var client = get_client(state.vars.account_number, an_pool,true);
        if (client === null || client.vars.registered === 0) {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else {
            var gen_input_review = require('./lib/enr-gen-order-review'); //todo: add prepayment calc
            var input_review_menu = gen_input_review(state.vars.account_number, service.vars.input21ATable, an_pool, lang);
            if(input_review_menu == null){
                var review_msg = msgs('no_produts_msg',{},lang);
                sayText(review_msg);
                promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else if (typeof (input_review_menu) == 'string') {
                sayText(input_review_menu);
                state.vars.multiple_review_menus = 0;
                state.vars.review_menu = input_review_menu;
                promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else {
                state.vars.multiple_review_menus = 1;
                state.vars.review_menu_loc = 0;
                state.vars.review_menu_length= Object.keys(input_review_menu).length;
                state.vars.current_review_str = input_review_menu[state.vars.review_menu_loc];
                sayText(state.vars.current_review_str);
                state.vars.review_menu = JSON.stringify(input_review_menu);
                promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
        }

    }
    else if(input == 3){
        sayText(state.vars.main_menu);
        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });

    }
    else {
        if (state.vars.multiple_input_menus) {
            var menu = JSON.parse(state.vars.input_menu)[0];
        }
        else {
            var menu = state.vars.input_menu;
        }
        state.vars.current_menu_str = menu;
        sayText(menu)
        promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
    }
});
//end input order handlers



/*
input handlers for order review
*/

addInputHandler('enr_order_review_continue', function (input) {
    notifyELK();
    state.vars.current_step = 'enr_order_review_continue';
    input = parseInt(input.replace(/\D/g, ''));
    if (input == 99) {
        sayText(msgs('exit', {}, lang));
        stopRules();
        return null;
    }
    else if(input == 1){
        state.vars.multiple_input_menus = 1;
        var client = get_client(state.vars.account_number, an_pool, true);
        if (client === null || client.vars.registered == 0) {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
        }
        if (client.vars.finalized == 1 && client.vars.geo !== 'Ruhango') { //fix next tine for generallity
            sayText(msgs('enr_order_already_finalized', {}, lang));
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if (client.vars.registered == 1) {
            // if client does not have a glvv id entered, prompt them to enter it before continuing
            var glvv_check = client.vars.glus || state.vars.glus;
            if (glvv_check == null || glvv_check == 0) {
                sayText(msgs('enr_missing_glvv', {}, lang));
                promptDigits('enr_glvv_id', { 'submitOnHash': false, 'maxDigits': max_digits_for_glus, 'timeout': timeout_length });
                return null;
            }
            // save glvv in client row
            client.vars.glus = state.vars.glus;
            client.save();
            // check if client is a group leader
            var gl_check = require('./lib/enr-group-leader-check');
            var is_gl = gl_check(state.vars.account_number, state.vars.glus, an_pool, glus_pool);
            // continue with order steps
            state.vars.session_authorized = true;
            state.vars.session_account_number = state.vars.account_number;
            state.vars.client_geo = client.vars.geo;
            //var prod_menu_select = require('./lib/enr-select-product-menu');
            //var product_menu_table_name = prod_menu_select(state.vars.client_geo, geo_menu_map);
            var product_menu_table_name = service.vars.input21ATable;
            state.vars.product_menu_table_name = product_menu_table_name;
            var populate_district_inputs_menu = require('./lib/populate-input-menu-by-district');
            var menu = populate_district_inputs_menu(lang);
            if (typeof (menu) == 'string') {
                state.vars.current_menu_str = menu;
                sayText(menu);
                state.vars.multiple_input_menus = 0;
                state.vars.input_menu = menu;
                promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
            else if (typeof (menu) == 'object') {
                state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
                state.vars.multiple_input_menus = 1;
                state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
                state.vars.current_menu_str = menu[state.vars.input_menu_loc];
                sayText(menu[state.vars.input_menu_loc]);
                state.vars.input_menu = JSON.stringify(menu);
                promptDigits('enr_input_splash', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            }
        }
        else {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits('invalid_input', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length })
        }

    }
    else if(input == 2){
        var client = get_client(state.vars.account_number, an_pool);
        if (client == null || client.vars.registered == 0) {
            sayText(msgs('account_number_not_found', {}, lang));
            contact.vars.account_failures = contact.vars.account_failures + 1;
            promptDigits(state.vars.current_step, { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
        else if (client.vars.finalized !== 1 || client.vars.finalized === undefined) {
            state.vars.session_account_number = state.vars.account_number;
            sayText(msgs('ENR_FINALIZE_TERMS_AND_CONDITION',{},lang));
            promptDigits('enr_terms_and_conditions', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            
        }
        else if (client.vars.finalized == 1) {
            sayText(msgs('enr_already_finalized', {}, lang));
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
    }
    else if(input == 3){
            sayText(state.vars.main_menu);
            promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
        }
    else if (state.vars.multiple_review_menus) {
        if (input == 44 && state.vars.review_menu_loc > 0) {
            state.vars.review_menu_loc = state.vars.review_menu_loc - 1;
            var menu = JSON.parse(state.vars.review_menu)[state.vars.review_menu_loc];
            sayText(menu);
            promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
        else if (input == 77 && (state.vars.review_menu_loc < state.vars.review_menu_length - 1)) {
            state.vars.review_menu_loc = state.vars.review_menu_loc + 1;
            menu = JSON.parse(state.vars.review_menu)[state.vars.review_menu_loc];
            sayText(menu);
            promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
        else if (input == 44 && state.vars.review_menu_loc == 0) {
            sayText(state.vars.main_menu);
            promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
            return null;
        }
    }
    // else if (state.vars.review_frame_loc < state.vars.review_frame_length - 1) { //watch for off by 1 errors
    //     state.vars.review_frame_loc = state.vars.review_frame_loc + 1;
    //     var input_review_menu = JSON.parse(state.vars.review_menu);
    //     state.vars.current_review_str = input_review_menu[state.vars.review_frame_loc];
    //     sayText(state.vars.current_review_str);
    //     promptDigits('enr_order_review_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    // }
    else {
        sayText(state.vars.main_menu);
        promptDigits('cor_menu_select', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
});
//end order review

/*
input handlers for finalize order
*/
addInputHandler('enr_finalize_verify', function (input) {
    notifyELK();
    state.vars.current_step = 'enr_finalize_verify';
    state.vars.splash = state.vars.current_step;
    input = parseInt(input.replace(/\D/g, ''));
    if (input == 1) {
        var enroll_in_roster = require('./lib/enr-order-in-roster');
        var success = enroll_in_roster(state.vars.session_account_number, state.vars.client_id, client_table);
        if (success) {
            sayText(msgs('enr_finalized', {}, lang));
            var client = get_client(state.vars.session_account_number, an_pool)
            client.vars.finalized = 1;
            client.save();

            //send an sms of orders once they choose to finalize
            var gen_sms_review = require('./lib/enr-send-order-sms');
            gen_sms_review(state.vars.account_number, service.vars.input21ATable, an_pool, lang);
        }else{
            sayText(msgs('enr_not_finalized', {}, lang));
            promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });           
        };


    }
    else {
        sayText(msgs('enr_not_finalized', {}, lang));
        promptDigits('cor_continue', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
  
});

//end finalize order



addInputHandler('enr_terms_and_conditions',function(input){
    notifyELK();
    input = parseInt(input.replace(/\D/g, ''));
    if(input == 1){
        sayText(msgs('enr_finalize_verify', {}, lang));
        promptDigits('enr_finalize_verify', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
    else{
        sayText(msgs('enr_not_finalized', {}, lang));
        sayText(msgs('ENR_FINALIZE_TERMS_AND_CONDITION',{},lang));
        promptDigits('enr_terms_and_conditions', { 'submitOnHash': false, 'maxDigits': max_digits_for_input, 'timeout': timeout_length });
    }
    
});
