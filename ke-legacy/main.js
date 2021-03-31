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


service.vars.server_name = project.vars[env+'_server_name'];
service.vars.roster_api_key = project.vars[env+'_roster_api_key'];
service.vars.currency = 'KES';

service.vars.topUpStart = env + '_start_top_up';
service.vars.topUpEnd = env + '_end_top_up';
service.vars.seed_germination_issues_table = env + '_seed_germination_issues';
service.vars.sbccTable = env + '_SBCC';

var notifyELK = require('../notifications/elk-notification/elkNotification');
var transactionHistory = require('../transaction-history/transactionHistory');
var clientRegistration = require('../client-registration/clientRegistration');
var clientEnrollment = require('../client-enrollment/clientEnrollment');
var justInTime = require('../just-in-time/justInTime');
var rosterAPI = require('../rw-legacy/lib/roster/api');
var dukaClient = require('../duka-client/dukaClient');
var isCreditOfficer = require('../duka-client/checkCreditOfficer');
var warrantyExpiration = require('../warranty-expiration/warrantyExpiration');
var seedGerminationIssues = require('../seed-germination-issues/seedGerminationIssues');
var foDetails = require('../fo-details/foDetails');
var contactCallCenter = require('../contact-call-center/contactCallCenter');
var shs = require('../shs/shs');
var slackLogger = require('../slack-logger/index');
var Log = require('../logger/elk/elk-logger');
var kenyaImpactTrainings = require('../kenya-impact-trainings/kenya-impact-trainings');
var TrainingTriggeredText = require('../kenya-impact-trainings/utils/TrainingTriggeredText');
var logger = new Log();

var dukaLocator = require('../duka-locator/index');
var groupRepaymentsModule = require('../group-repayments/groupRepayments');
var sbccModule = require('../sbcc/ussd/sbcc');
service.vars.server_name = project.vars[env+'_server_name'];
service.vars.roster_api_key = project.vars[env+'_roster_api_key'];
service.vars.roster_read_key = project.vars.roster_read_key;
service.vars.lr_2021_client_table_id = project.vars[env+'_lr_2021_client_table_id'];
service.vars.registerEnrollEnd = env+ '_registerEnrollEnd';
service.vars.registerEnrollStart = env + '_registerEnrollStart';
service.vars.seedQualityIssuesStart = env + '_seedQualityIssuesStart';
service.vars.seedQualityIssuesEnd = env + '_seedQualityIssuesEnd';

var checkGroupLeader = require('../shared/rosterApi/checkForGroupLeader');
const nonClientMainMenu = require('./utils/menus/populate-menu/nonClientMainMenu');
service.vars.credit_officers_table = 'credit_officers_table';
service.vars.duka_clients_table = env + '_duka_client_registration';
service.vars.maizeEnrollmentTableId  = project.vars[env + '_maize_enr_table_id'];
service.vars.maizeTableId = project.vars[env + '_maize_bundle_table_id'];
service.vars.topUpBundleTableId = project.vars[env + '_topUp_bundlesId'];
service.vars.enrollmentBundleTableId = project.vars[env + '_enrollment_bundles_id'];
//
service.vars.districtVarietyTableId = project.vars[env + '_districtVarietyTableId'];
service.vars.varietyStockTableId = project.vars[env + '_varietyStockTableId'];
service.vars.warehouseStockTableId = project.vars[env + '_warehouseStockTableId'];
service.vars.districtWarehouseTableId = project.vars[env+ '_districtWarehouseTableId'];
service.vars.shs_reg_endpoint = project.vars[env+'_shs_reg_endpoint'];
service.vars.shs_apikey = project.vars[env+'_shs_api_key'];

if(env == 'prod'){
    service.vars.JiTEnrollmentTableId = 'DT52cebb451097ac25';
    service.vars.JITSucessfullRegId = 'DTa403c7245c904c18';
    service.vars.SiteLockingTableId = 'DTdef8fbbf26e21f5e';
    
}
else{
    service.vars.JiTEnrollmentTableId = 'DT7a66f47aa004743c';
    service.vars.JITSucessfullRegId = 'DT12cc1d618437e58b';
    service.vars.SiteLockingTableId = 'DTa75d9c02bd403ebc';
}

var MenuCount = 0;
var LocArray='';
var ClientAccNum = '';
var CurrentSeasonName = '2021, Long Rain';
var LastSeason = '2020, Long Rain';
var client = '';
var JITBundleOptions =[
    {'nameEN': '0.5 acre maize',
        'nameSW': 'Mahindi Nusu Ekari',
        'price': 5580,
        'bundlename': '0.5 Maize',
        'relatedbundles': [{'bundlename': '0.25 Maize'}],
        'variety': true,
        'unitnumber': 3,
        'JITE': true
    },
    {'nameEN': '0.25 acre maize',
        'nameSW': 'Mahindi Robo Ekari',
        'price': 3170,
        'bundlename': '0.25 Maize',
        'relatedbundles': [{'bundlename': '0.5 Maize'}],
        'variety': true,
        'unitnumber': 2,
        'JITE': true
    },
    {'nameEN': 'Harvest Drying Sheet',
        'nameSW': 'Chandarua',
        'price': 3890,
        'bundlename': 'Harvest Drying Sheet',
        'relatedbundles': [],
        'variety': false,
        'unitnumber': 1,
        'JITE': false
    },
    {'nameEN': 'Sunking Boom',
        'nameSW': 'Taa ya Sunking Boom',
        'price': 5090,
        'bundlename': 'Sun King Boom',
        'relatedbundles': [],
        'variety': false,
        'unitnumber': 1,
        'JITE': false
    },
    {'nameEN': 'Basic Mobile Phone Techno 349',
        'nameSW': 'Simu ya Kubofia Techno 349',
        'price': 1950,
        'bundlename': 'Basic Phone',
        'relatedbundles': [],
        'variety': false,
        'unitnumber': 1,
        'JITE': false
    },
];
var JITTUMaxOrders = 3;
var FAWUnitPrice = 720;
var FAWMaxOrders = 2;
var StaffDistrict = 'KENYA STAFF';

// Setting global functions
var InteractionCounter = function(input){
    try{
        if (typeof(state.vars.InteractionCount) == 'undefined') {state.vars.InteractionCount = 1;}
        else{state.vars.InteractionCount = state.vars.InteractionCount +1;}
        call.vars.InteractionCount = state.vars.InteractionCount;
        if (typeof(input) !== 'undefined') {
            var varString = 'call.vars.TimeStamp_'+input+'= Now';
            eval(varString);
        }
    }
    catch(err) {
        console.log('Error occurred in interaction counter');
    }
    notifyELK();
};
var GetBalance = function (client, season){
    var balance = 0;
    var arrayLength = client.BalanceHistory.length;
    for (var i = 0; i < arrayLength; i++) {
        if (client.BalanceHistory[i].SeasonName ==season){balance = client.BalanceHistory[i].Balance;}}
    return balance;
};
var GetRepaid = function (client, season){
    var repaid = 0;
    var arrayLength = client.BalanceHistory.length;
    for (var i = 0; i < arrayLength; i++) {
        if (client.BalanceHistory[i].SeasonName ==season){repaid = client.BalanceHistory[i].TotalRepayment_IncludingOverpayments;}}
    return repaid;
};

var ValidPN = function(phonenumber){
    if (phonenumber.length === 10 && phonenumber.substring(0, 2)=='07'){return true;}
    else {return false;}
};
var LogSessionID = function(){
    console.log('Unique session id: '+call.id);
};
var TrimClientJSON = function(client){
    var SeasonCount = client.BalanceHistory.length;
    if (SeasonCount>3){client.BalanceHistory.length = 3;}
    return client;
};
var GetLang = function(){
    if(state.vars.English === true){
        service.vars.lang = 'en-ke';
        contact.vars.lang = 'en-ke';
        state.vars.lang = 'en-ke';
        return true;
    } else {
        service.vars.lang = 'sw';
        contact.vars.lang = 'sw';
        state.vars.lang = 'sw';
        return false;
    }
};
var ChangeLang = function (){
    if (state.vars.English === true){
        state.vars.English = false;
        contact.vars.lang = 'sw';
        state.vars.lang = 'sw';
    }
    else {
        state.vars.lang = 'en-ke';
        contact.vars.English = true;
        state.vars.English = true;
    }
    contact.save();
};
var RosterClientVal = function (AccNum){
    if (typeof AccNum === 'undefined' || AccNum == ''){
        return false;
    }
    else{
        console.log('Validating accountnumber length. Result: '+ AccNum.length);
        if (AccNum.length == 8){
            rosterAPI.verbose = true;
            //rosterAPI.dataTableAttach();
            return rosterAPI.authClient(AccNum,'KE');
        }
        else {
            return false;
        }
    }
};
var RosterClientGet = function (AccNum){
    rosterAPI.verbose = true;
    //rosterAPI.dataTableAttach();
    client = rosterAPI.getClient(AccNum,'KE');
    return client;
};


var RosterColRequest = function (AccNum,Amount){
    rosterAPI.verbose = true;
    //rosterAPI.dataTableAttach();
    var phone = {
        country: 'KE',
        phone_number: '+'+PhoneNumber.formatInternationalRaw(contact.phone_number, 'KE')
    };
    var provider='Beyonic';
    var colResult = rosterAPI.collectPayment(AccNum,Amount , phone, provider);
    console.log(JSON.stringify(colResult));
    if (colResult.Success) {console.log('The user will get PIN authorization form on their phone to pay OAF');}
    else {console.log(colResult.Description + 'Try again');}
    call.vars.colreqTimeStamp = moment().format('X');
    notifyELK();
    if(!colResult.Success){
        try {
            throw new Error('KE USD Collection RequestKE USD Collection Request failed');
        } catch (error) {
            logger.error(error.message,{data: colResult});
            slackLogger.log(error.message+ '>'+JSON.stringify(error)+'\n>'+JSON.stringify(colResult));
        }
    }
    return colResult.Success;
};

var TriggerTraining = function (ServiceID){
    try{
        var service = project.initServiceById(ServiceID);
        service.invoke({
            context: 'contact',
            contact_id: contact.id
        });
    }
    catch(err){
        slackLogger.log('Error triggering service: ' + ServiceID + JSON.stringify({error: err}));
        sendEmail('tom.vranken@oneacrefund.org', 'URGENT - Service ID misconfiguration for aggr training', 'Service ID: '+ ServiceID);
    }
};

var LocationNotKnown = function (Location){
    if (Location == '#'|| Location == '0'){
        LocationNotKnownText();
        hangUp();
    }
};

var FOLocatorNextSelect = function(Location){
    if (Location == 'n' || Location == 'N' || Location =='00'){console.log('Fo locator Next selected');return true;}
    else {return false;}
};
var ValNationalID = function(input){
    var NumChar = input.length;
    if (NumChar == 7 || NumChar == 8){return true;}
    else {return false;}
};

var GetPrepaymentAmount = function(client){
    return client.BalanceHistory[0].TotalCredit * 0.1;
};
var FAWActive = function (districtname){
    var Table = project.getOrCreateDataTable('FAW Districts');
    var Cursor = Table.queryRows({vars: {'districtname': districtname, 'active': '1'}});
    if (Cursor.count()>0){return true;}
    else {return false;}
};
var FAWOrdersPlaced = function (accnum){
    var table = project.getOrCreateDataTable('FAWOrders');
    var rowcursor = table.queryRows({vars: {'accountnumber': accnum}});
    var SumOrder = 0;
    var CancelMaxTime = moment().subtract(5, 'days').format('X');
    console.log('Max cancel time is'+CancelMaxTime);
    state.vars.FAWAllowcancel = false;
    state.vars.FAWCancelAmount = 0;
    while (rowcursor.hasNext()) {
        var row = rowcursor.next();
        console.log('Time created is: '+row.time_created);
        if (row.time_created>CancelMaxTime){
            state.vars.FAWAllowcancel = true;
            state.vars.FAWCancelAmount = Number(state.vars.FAWCancelAmount) + Number(row.vars.bundlequantity);
        }
        SumOrder = SumOrder + parseInt(row.vars.bundlequantity);
    }
    console.log('Allowed cancellation amount is: '+ state.vars.FAWCancelAmount);
    return SumOrder;
};

var FAWProcessCancel= function(accnum, CancelAmount){
    var table = project.getOrCreateDataTable('FAWOrders');
    var rowcursor = table.queryRows({sort_dir: 'desc', vars: {'accountnumber': accnum}});
    console.log('Retrieved row count: '+rowcursor.count());
    var ToCancelCount = CancelAmount;
    var now = moment().format('L');
    while (rowcursor.hasNext() && ToCancelCount>0) {
        console.log('to cancel amount is '+ToCancelCount);
        var row = rowcursor.next();
        console.log('Processing row with quanity '+row.vars.bundlequantity);
        if (row.vars.bundlequantity == ToCancelCount){
            row.vars.accountnumber = row.vars.accountnumber + 'Cancelled';
            row.vars.changenote = 'Cancelled on '+now;
            ToCancelCount = 0;
            row.save();
            break;
        }
        else if(row.vars.bundlequantity > ToCancelCount){
            var NewQuantity = row.vars.bundlequantity - ToCancelCount;
            row.vars.changenote = 'Quantity changed from '+row.vars.bundlequantity+' to '+ NewQuantity+' on '+now;
            row.vars.bundlequantity = NewQuantity;
            ToCancelCount = 0;
            row.save();
            break;
        }
        else{
            NewQuantity = row.vars.bundlequantity - ToCancelCount;
            row.vars.changenote = 'Quantity changed from '+row.vars.bundlequantity+' to '+ NewQuantity+' on '+now;
            row.vars.bundlequantity = NewQuantity;
            ToCancelCount = ToCancelCount - row.vars.bundlequantity;
            row.save();
        }
    }
};


var FAWCreateOrder = function(client, order){
    var table = project.getOrCreateDataTable('FAWOrders');
    var row = table.createRow({
        vars: {'accountnumber': client.AccountNumber,
            'date_created': moment().format('DD-MM-YYYY'),
            'districtname': client.DistrictName,
            'globalid': client.GlobalClientId,
            'firstname': client.FirstName,
            'lastname': client.LastName,
            'creditcyclename': CurrentSeasonName,
            'bundlename': '',
            'bundlequantity': order,
            'action': 'Insert'}});
    row.save();
};
var EnrolledAndQualified = function (client){
    var arrayLength = client.BalanceHistory.length;
    var Valid = false;
    for (var i = 0; i < arrayLength; i++) {
        if (client.BalanceHistory[i].SeasonName == CurrentSeasonName){
            if(client.BalanceHistory[i].TotalCredit> 0){Valid = true;}
        }
    }
    return Valid;
};
var JITTUCheckPreviousOrder = function(BundleOption, accnum){
    var JITTUOrdersTable = project.getOrCreateDataTable('JITTU_Orders');
    var JITTUOrderPrimaryCursor = JITTUOrdersTable.queryRows({vars: {'bundlename': BundleOption.bundlename ,'accnum': accnum }});
    if (JITTUOrderPrimaryCursor.count()>0){return true;}
    else {return false;}
};
var JITTUCheckSecondairyOrder = function(BundleOption, accnum){
    var JITTUOrdersTable = project.getOrCreateDataTable('JITTU_Orders');
    var checkrelated = false;
    for (var i = 0; i < BundleOption.relatedbundles.length; i++) {
        var RelatedBundleName = BundleOption.relatedbundles[i].bundlename;
        var JITTUOrderRelatedCursor = JITTUOrdersTable.queryRows({vars: {'bundlename': RelatedBundleName ,'accnum': accnum }});
        if (JITTUOrderRelatedCursor.count()>0){checkrelated = true;}
    }
    return checkrelated;
};
var JITCheckStockAvailable = function(warehousename, bundlename, checkvarieties){
    var AvailableStock = 0;
    var JITWarehouseTable = project.getOrCreateDataTable('JIT Warehouse stock');
    var JITWarehouseCursor = JITWarehouseTable.queryRows({vars: {'warehousename': warehousename,'bundlename': bundlename}});
    JITWarehouseCursor.limit(1);
    if (JITWarehouseCursor.count()>0){
        var valid = false;
        if (checkvarieties){
            if(JITGetVarieties(warehousename).length>0){valid = true;}
        }
        else {valid = true;}
        if (valid){
            var JITWarehouseRow = JITWarehouseCursor.next();
            AvailableStock = JITWarehouseRow.vars.quanityavailable - JITWarehouseRow.vars.quanityordered;
        }
    }
    if (AvailableStock>0){return true;}
    else {return false;}
};
var JITTUGetOrderCount = function(accnum){
    var JITTUOrdersTable = project.getOrCreateDataTable('JITTU_Orders');
    var JITTUOrderCursor = JITTUOrdersTable.queryRows({vars: {'accnum': accnum }});
    return JITTUOrderCursor.count();
};
var JITgetWarehouse = function(districtname){
    var JITDistrictTable = project.getOrCreateDataTable('JIT_Districts');
    var JITTUDistrictCursor = JITDistrictTable.queryRows({vars: {'districtname': districtname}});
    JITTUDistrictCursor.limit(1);
    var warehousename = false;
    if (JITTUDistrictCursor.count()>0){
        var JITTUDistrictkRow = JITTUDistrictCursor.next();
        warehousename = JITTUDistrictkRow.vars.warehouse;
    }
    return warehousename;
};
var JITTUGetOrderOptions = function (client){
    var accnum = client.AccountNumber;
    var JITTUOrdersAvailable = [];
    var OrderCount = JITTUGetOrderCount (accnum);
    if (OrderCount>=JITTUMaxOrders){
        console.log('already placed maximum number of orders.');
    }
    else{
        var districtname = client.DistrictName;
        var warehousename = JITgetWarehouse(districtname);
        for (var i = 0; i < JITBundleOptions.length; i++) {
            var OrderPreviously = JITTUCheckPreviousOrder(JITBundleOptions[i], accnum);
            var OrderSecondairy = JITTUCheckSecondairyOrder(JITBundleOptions[i], accnum);
            var OptionAvailable = JITCheckStockAvailable(warehousename, JITBundleOptions[i].bundlename,JITBundleOptions[i].variety);
            if (OrderPreviously === false && OrderSecondairy ===false && OptionAvailable){
                console.log(JITBundleOptions[i].bundlename+ 'Available');
                var JITTU_order = {
                    'bundlename': JITBundleOptions[i].bundlename,
                    'nameEN': JITBundleOptions[i].nameEN,
                    'nameSW': JITBundleOptions[i].nameSW,
                    'price': JITBundleOptions[i].price,
                    'variety': JITBundleOptions[i].variety,
                    'unitnumber': JITBundleOptions[i].unitnumber
                };
                JITTUOrdersAvailable.push(JITTU_order);
            }
            else{console.log(JITBundleOptions[i].bundlename+ 'Not Available');}
        }
    }
    state.vars.JITTUOrdersAvailable = JSON.stringify(JITTUOrdersAvailable);
    console.log(state.vars.JITTUOrdersAvailable);
    return JITTUOrdersAvailable;
};
var JITTURetrieveOrders = function (accnum){
    var JITTUOrdersPlaced = [];
    for (var i = 0; i < JITBundleOptions.length; i++) {
        var Ordered = JITTUCheckPreviousOrder(JITBundleOptions[i], accnum);
        if (Ordered){
            var JITTU_order = {
                'bundlename': JITBundleOptions[i].bundlename,
                'nameEN': JITBundleOptions[i].nameEN,
                'nameSW': JITBundleOptions[i].nameSW,
                'price': JITBundleOptions[i].price
            };
            JITTUOrdersPlaced.push(JITTU_order);
        }
    }
    return JITTUOrdersPlaced;
};
var JITECheckPreviousAccNum = function (accnum){
    var PreviousOrder = false;
    var JITETable = project.getOrCreateDataTable('JITE_Orders');
    var JITECursor = JITETable.queryRows({vars: {'accountnumber': accnum}});
    if (JITECursor.count()>0){PreviousOrder = true;}
    return PreviousOrder;
};
var JITECheckPreviousNationalID = function (nationalid){
    var PreviousOrder = false;
    var JITETable = project.getOrCreateDataTable('JITE_Orders');
    var JITECursor = JITETable.queryRows({vars: {'nationalid': nationalid}});
    if (JITECursor.count()>0){PreviousOrder = true;}
    return PreviousOrder;
};
var JITTUOrderOverview = function (JIT_client){
    var OrdersPlaced = JITTURetrieveOrders(JIT_client.AccountNumber);
    if(OrdersPlaced.length === 0){
        var BundleOptions = JITTUGetOrderOptions(JIT_client);
        JITBundleSelectText(BundleOptions);
        promptDigits('JITTUBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        JITTUShowOrdersText(OrdersPlaced);
        if (OrdersPlaced.length<JITTUMaxOrders){promptDigits('ContinueToJITTUBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});}
        else{promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});}
    }
};
var JITGetVarieties = function(warehousename){
    var JITVarietiesTable = project.getOrCreateDataTable('JIT Warehouse varieties');
    var JITVarietiesCursor = JITVarietiesTable.queryRows({vars: {'warehousename': warehousename}});
    var varieties = [];
    while (JITVarietiesCursor.hasNext()){
        var VarietyRow = JITVarietiesCursor.next();
        var available =  VarietyRow.vars.quantityavailable -  VarietyRow.vars.quantityordered;
        if (available>0){
            var variety = VarietyRow.vars.variety;
            varieties.push(variety);}
    }
    state.vars.varieties = JSON.stringify(varieties);
    return varieties;
};
var JITTUCreateOrder = function(client,bundle,variety){
    var warehousename = JITgetWarehouse(client.DistrictName);
    var JITTUOrdersTable = project.getOrCreateDataTable('JITTU_Orders');
    var JITTUOrderRow = JITTUOrdersTable.createRow({
        vars: {
            'DistrictName': client.DistrictName,
            'SiteName': client.SiteName,
            'GlobalClientId': client.GlobalClientId,
            'FirstName': client.FirstName,
            'LastName': client.LastName,
            'CreditCycleName': CurrentSeasonName,
            'accnum': client.AccountNumber,
            'bundlename': bundle.bundlename,
            'variety': variety,
            'warehousename': warehousename,
            'quantity': 1,
            'action': 'insert'
        }
    });
    JITTUOrderRow.save();
    JITUpdateWarehouse(warehousename,bundle.bundlename,variety);
};
var JITEGetOrderOptions = function (){
    var JITEOrdersAvailable = [];
    var districtname = client.DistrictName;
    var warehousename = JITgetWarehouse(districtname);
    for (var i = 0; i < JITBundleOptions.length; i++) {
        if (JITBundleOptions[i].JITE){
            var OptionAvailable = JITCheckStockAvailable(warehousename, JITBundleOptions[i].bundlename,JITBundleOptions[i].variety);
            if (OptionAvailable){
                var JITE_order =  {
                    'bundlename': JITBundleOptions[i].bundlename,
                    'nameEN': JITBundleOptions[i].nameEN,
                    'nameSW': JITBundleOptions[i].nameSW,
                    'price': JITBundleOptions[i].price,
                    'variety': JITBundleOptions[i].variety,
                    'unitnumber': JITBundleOptions[i].unitnumber
                };
                JITEOrdersAvailable.push(JITE_order);
            }
            else{console.log(JITBundleOptions[i].bundlename+ 'Not Available');}
        }
    }
    state.vars.JITEOrdersAvailable = JSON.stringify(JITEOrdersAvailable);
    return JITEOrdersAvailable;
};
var JITECreateOrder = function (accnum,firstname, lastname,nationalid, GLclient,bundleselected,variety, warehousename, phonenumber){
    var JITEOrdersTable = project.getOrCreateDataTable('JITE_Orders');
    var JITEOrderRow = JITEOrdersTable.createRow({
        vars: {
            'accountnumber': accnum,
            'bundlename': bundleselected.bundlename,
            'variety': variety,
            'firstname': firstname,
            'lastname': lastname,
            'nationalid': nationalid,
            'GLAccNum': GLclient.AccountNumber,
            'GLGroup': GLclient.GroupName,
            'GLSite': GLclient.SiteName,
            'GLDistrict': GLclient.DistrictName,
            'warehousename': warehousename,
            'quantity': 1,
            'phonenumber': phonenumber
        }
    });
    JITEOrderRow.save();
    JITUpdateWarehouse(warehousename,bundleselected.bundlename,variety);
};
var JITUpdateWarehouse = function (warehousename,bundlename,variety){
    var table = project.getOrCreateDataTable('JIT Warehouse stock');
    var StockCursor = table.queryRows({vars: {'bundlename': bundlename, 'warehousename': warehousename}});
    StockCursor.limit(1);
    var JITTUOrderCount = 0;
    var JITEOrderCount = 0;
    if (StockCursor.hasNext()){
        var  StockRow = StockCursor.next();
        var JITETable = project.getOrCreateDataTable('JITE_Orders');
        var JITECursor = JITETable.queryRows({vars: {'bundlename': bundlename, 'warehousename': warehousename}});
        JITEOrderCount = JITECursor.count();
        var JITTUTable = project.getOrCreateDataTable('JITTU_Orders');
        var  JITTUCursor = JITTUTable.queryRows({vars: {'bundlename': bundlename, 'warehousename': warehousename}});
        JITTUOrderCount = JITTUCursor.count();
        StockRow.vars.quanityordered = JITEOrderCount+ JITTUOrderCount;
        StockRow.save();
    }
    else {sendEmail('charles.lipeyah@oneacrefund.org ', 'JIT Data error', 'No stock record found for '+ bundlename+ 'in warehouse '+ warehousename+ 'Check here to verify https://telerivet.com/p/0c6396c9/data/JIT_20Warehouse_20stock' );}
    for (var i = 0; i < JITBundleOptions.length; i++) {
        console.log(JITBundleOptions[i].bundlename);
        if (JITBundleOptions[i].bundlename == bundlename && JITBundleOptions[i].variety === true){
            var VarTable = project.getOrCreateDataTable('JIT Warehouse varieties');
            var VarStockCursor = VarTable.queryRows({vars: {'variety': variety, 'warehousename': warehousename}});
            VarStockCursor.limit(1);
            if (VarStockCursor.hasNext()){
                var  VarStockRow = VarStockCursor.next();
                VarStockRow.vars.quantityordered = JITEOrderCount*JITBundleOptions[i].unitnumber + JITTUOrderCount*JITBundleOptions[i].unitnumber;
                VarStockRow.save();
            }

            else{
                sendEmail('charles.lipeyah@oneacrefund.org ', 'JIT Data error', 'No stock record found for '+  variety+ 'in warehouse '+ warehousename+ 'Check here to verify https://telerivet.com/p/0c6396c9/data/JIT_20Warehouse_20varieties' );
            }
        }
    }
};
var SHSValidateReg = function(client, seasonname){
    var valid = false;
    var OrdersTable = project.getOrCreateDataTable('SHS orders');
    var  OrderCursor = OrdersTable.queryRows({vars: {'accountnumber': client.AccountNumber, 'season': seasonname}});
    if (OrderCursor.count()>0){
        valid = true;
        var SHSTypeArray = [];
        state.vars.SHS_Type = '';
        while (OrderCursor.hasNext()) {
            var row = OrderCursor.next();

            if (SHSTypeArray.indexOf(row.vars.shs_type) == -1){
                SHSTypeArray.push(row.vars.shs_type);
                console.log(JSON.stringify(SHSTypeArray));
            }
            else{console.log('Skip');}
            state.vars.SHS_Type = JSON.stringify(SHSTypeArray);
        }
    }
    return valid;
};
var SHSValidateSerial = function(accountnumber,serialnumber, type){
    var CheckStatus = function (SerialCursor){
        var status = '';
        if (SerialCursor.count() === 0){status = 'NotFound';}
        else if (SerialCursor.count() === 1){
            var SerialRow = SerialCursor.next();
            state.vars.SHS_Type = SerialRow.vars.shs_type;
            if (SerialRow.vars.assigned){
                if (SerialRow.vars.accountnumber == accountnumber){status = 'RegAccNum';}
                else {status = 'RegOther';}
            }
            else {
                status = 'NotReg';
            }
        }
        else {status = 'MultipleFound';}
        console.log('Status for SHS serial number validate: '+status);
        return status;
    };
    var Serialtable = project.getOrCreateDataTable('SHS Serial Numbers');
    if (typeof type === 'undefined' || type == ''){
        var SerialCursor = Serialtable.queryRows({vars: {'serial_number': serialnumber, 'season': CurrentSeasonName}});
        return CheckStatus(SerialCursor);
    }
    else {
        SerialCursor = Serialtable.queryRows({vars: {'serial_number': serialnumber, 'shs_type': type, 'season': CurrentSeasonName}});
        return CheckStatus(SerialCursor);
    }
};
var SHSRegThisSeason= function(accountnumber){
    var OrderTable = project.getOrCreateDataTable('SHS Orders');
    var  OrderCursor = OrderTable.queryRows({vars: {'accountnumber': accountnumber, 'season': CurrentSeasonName}});
    var OrderCount = OrderCursor.count();
    console.log('Allowed orders this season: '+OrderCount);

    var table = project.getOrCreateDataTable('SHS Serial Numbers');
    var  Cursor = table.queryRows({vars: {'accountnumber': accountnumber, 'season': CurrentSeasonName}});
    console.log('Registered SHSes this season: '+Cursor.count());
    if(Cursor.count() >= OrderCount){return true;}
    else {return false;}
};
var SHSRegSerial = function(client,serialnumber, type){
    var RegSerial = function (SerialCursor, client){
        var SerialRow = SerialCursor.next();
        SerialRow.vars.accountnumber = client.AccountNumber;
        SerialRow.vars.date_assigned = moment().format('DD-MM-YYYY');
        SerialRow.vars.district = client.DistrictName;
        SerialRow.vars.site = client.SiteName;
        SerialRow.vars.group = client.GroupName;
        SerialRow.vars.assigned = true;
        SerialRow.save();
    };
    var Serialtable = project.getOrCreateDataTable('SHS Serial Numbers');
    if (typeof type === 'undefined'){
        var SerialCursor = Serialtable.queryRows({vars: {'serial_number': serialnumber}});
        RegSerial(SerialCursor, client);
    }
    else {
        SerialCursor = Serialtable.queryRows({vars: {'serial_number': serialnumber, 'shs_type': type}});
        RegSerial(SerialCursor, client);
    }
};
var GetSHSDetails = function(accountnumber, serialnumber, type){
    var SerialInfo = function (SerialCursor){
        if (SerialCursor.hasNext()){
            var SerialRow = SerialCursor.next();
            var SerialReturn = {
                'Status': 'Found',
                'ActivationCode': SerialRow.vars.activation_code,
                'UnlockCode': SerialRow.vars.unlockcode,
                'season': SerialRow.vars.season
            };
            return SerialReturn;
        }
        else {return 'Not found';}
    };
    var Serialtable = project.getOrCreateDataTable('SHS Serial Numbers');
    if (typeof type === 'undefined'){
        var  SerialCursor = Serialtable.queryRows({vars: {'serial_number': serialnumber,'accountnumber': accountnumber }});
        return SerialInfo(SerialCursor);
    }
    else {
        SerialCursor = Serialtable.queryRows({vars: {'serial_number': serialnumber, 'shs_type': type, 'accountnumber': accountnumber}});
        return SerialInfo(SerialCursor);
    }
};
var GetSerialForClient = function (accountnumber){
    var table = project.getOrCreateDataTable('SHS Serial Numbers');
    var Cursor = table.queryRows({vars: {'accountnumber': accountnumber}});
    var SerialList = [];
    while (Cursor.hasNext()) {
        var row = Cursor.next();
        var Serial = {
            'SerialNumber': row.vars.serial_number,
            'Season': row.vars.season,
        };
        SerialList.push(Serial);
    }
    return SerialList;
};
var SHSShowCode = function(client,serial,type){
    var SHSDetail = '';
    if (typeof type === 'undefined'){SHSDetail = GetSHSDetails(client.AccountNumber, serial);}
    else {SHSDetail = GetSHSDetails(client.AccountNumber, serial,type);}
    if (SHSDetail == 'NotFound'){return false;}
    else{
        var arrayLength = client.BalanceHistory.length;
        for (var i = 0; i < arrayLength; i++) {
            if (client.BalanceHistory[i].SeasonName == SHSDetail.season){
                if (client.BalanceHistory[i].Balance>0){
                    state.vars.SHSCode = SHSDetail.ActivationCode;
                    SHSActivationCodeText(SHSDetail.ActivationCode);
                    SHSCodeSMS(SHSDetail.ActivationCode);
                    promptDigits('SHSCodeContinue', {submitOnHash: true, maxDigits: 1, timeout: 5});
                    return true;
                }
                else {
                    state.vars.SHSCode = SHSDetail.UnlockCode;
                    SHSUnlockText(SHSDetail.UnlockCode, SHSDetail.season);
                    SHSCodeSMS(SHSDetail.UnlockCode);
                    promptDigits('SHSCodeContinue', {submitOnHash: true, maxDigits: 1, timeout: 5});
                    return true;
                }
            }
            else {return false;}
        }
    }
};

var StaffCallBackCreate = function(phonenumberCB,type,Body){
    var CEEmail = 'support@oneacrefund-ke.zendesk.com';
    var Subject = 'Call back requested for: '+type+ ' From '+ phonenumberCB;
    sendEmail(CEEmail, Subject, Body);
};
var LocationNext = function (){
    LocArray = JSON.parse(state.vars.LocArray);
    console.log(state.vars.LocArray);
    state.vars.MenuNext = false;
    MenuText ='';
    var  LocMenu = '';
    for (var i = state.vars.MenuCount; i < LocArray.length; i++) {
        var MenuText =LocMenu + LocArray[i].Menu+ ') ' + LocArray[i].Name+'\n';
        if(MenuText.length < 110){LocMenu = MenuText;}
        else{
            MenuCount = i;
            state.vars.MenuCount = i;
            state.vars.MenuNext = true;
            if (GetLang()){LocMenu= LocMenu+'0) Next';}
            else {LocMenu= LocMenu+'0) Ukurasa Ufwatao';}
            i = 9999;
        }
    }
    return LocMenu;
};
var HospitalTownsRetrieve = function(regionid){
    var  LocMenu = '' ;
    var LocTable = project.getOrCreateDataTable('Hospital_Towns');
    var TownList = LocTable.queryRows({vars: {'region_id': regionid}});
    var TownArray = [];
    while (TownList.hasNext()) {
        var TownRow = TownList.next();
        var Location = {
            'Name': TownRow.vars.name,
            'ID': TownRow.vars.id,
            'Menu': TownRow.vars.id.substring(regionid.length+1)
        };
        TownArray.push(Location);
    }
    TownArray.sort(function(a, b){return a.Menu-b.Menu;});
    state.vars.LocArray = JSON.stringify(TownArray);
    console.log(JSON.stringify(TownArray));
    LocMenu = '';
    MenuCount = 0;

    for (var i = MenuCount; i < TownArray.length; i++) {
        console.log('Building menu text');
        var MenuText = LocMenu + TownArray[i].Menu+ ') '+ TownArray[i].Name+'\n';
        console.log(MenuText.length);
        if(MenuText.length < 110){
            LocMenu = MenuText;
        }
        else{
            MenuCount = i;
            state.vars.MenuCount = i;
            state.vars.MenuNext = true;
            if (GetLang()){LocMenu = LocMenu+'0) Next';}
            else {LocMenu= LocMenu+'0) Ukurasa Ufwatao';}
            i = 9999;
        }
    }
    return LocMenu;
};
var ValidateHostitalInput = function(input){
    var LocValid = false;
    LocArray = JSON.parse(state.vars.LocArray);
    console.log(JSON.stringify(LocArray));
    for (var i = 0; i < LocArray.length; i++) {
        if (LocArray[i].Menu == input) {
            state.vars.locID = LocArray[i].ID;
            LocValid = true;
        }
    }
    return LocValid;
};
var HospitalsRetrieve = function(townid){
    var LocMenu = '' ;
    var LocTable = project.getOrCreateDataTable('Hospital_Hospitals');
    var  HospitalList = LocTable.queryRows({vars: {'town_id': townid}});
    HospitalList.limit(50);
    console.log(HospitalList.count());
    var HospitalArray = [];
    while (HospitalList.hasNext()) {
        var HosRow = HospitalList.next();
        var Location = {
            'Name': HosRow.vars.name,
            'ID': HosRow.vars.id,
            'Menu': HosRow.vars.id.substring(townid.length+1)
        };
        HospitalArray.push(Location);
    }
    HospitalArray.sort(function(a, b){return a.Menu-b.Menu;});
    console.log(JSON.stringify(HospitalArray));
    state.vars.LocArray = JSON.stringify(HospitalArray);
    LocMenu = '';
    MenuCount = 0;
    for (var i = MenuCount; i < HospitalArray.length; i++) {
        var MenuText = LocMenu + HospitalArray[i].Menu+ ') '+ HospitalArray[i].Name+'\n';
        console.log(MenuText.length);
        if(MenuText.length < 110){LocMenu = MenuText;}
        else{
            MenuCount = i;
            state.vars.MenuCount = i;
            state.vars.MenuNext = true;
            if (GetLang()){LocMenu = LocMenu+'0) Next';}
            else {LocMenu= LocMenu+'0) Ukurasa Ufwatao';}
            i = 9999;
        }
    }
    return LocMenu;
};
var ValidPayRollID = function(payrollid){
    var Table = project.getOrCreateDataTable('Staff');
    var Cursor = Table.queryRows({vars: {'payrollid': payrollid}});
    if (Cursor.count()>0){return true;}
    else {return false;}
};

var GetStaffDetails = function(payrollid){
    console.log('Retrieving details for payroll id: '+ payrollid);
    var Table = project.getOrCreateDataTable('Staff');
    var  Cursor = Table.queryRows({vars: {'payrollid': payrollid}});
    Cursor.limit(1);
    if (Cursor.hasNext()){
        var Row = Cursor.next();
        var StaffDetail = {
            'name': Row.vars.firstname,
            'email': Row.vars.emailadress,
            'payrollid': Row.vars.payrollid,
        };
        return StaffDetail;
    }
    else {return false;}
};

var StaffCreateRequest = function(payrollid,startday,amount){
    var Table = project.getOrCreateDataTable('Staff_AbsenceRequest');
    var startdaydesc = 'Today';
    if (startday == 2){startdaydesc = 'Yesterday';}
    else if (startday == 3){startdaydesc = 'Tomorrow';}
    var Row = Table.createRow({
        vars: {
            'payrollid': payrollid,
            'startday': startdaydesc,
            'amount': amount
        }
    });
    Row.save();
};

//MAIN FUNCTIONS OR GENERIC TEXT
var SplashMenuText = function (){
    if (GetLang()){sayText('Welcome to the One Acre Fund. Press 0 if you do not have One Acre Fund account.If you have an account, Please enter your 8-digit account number 99) Swahili');}
    else {sayText('Karibu One Acre Fund. Bonyeza 0 kama hauna nambari ya akaunti ya One Acre Fund.Kama uko na akaunti ya One Acre Fund, Weka nambari ya akaunti yako 99) English');}

};
var SplashMenuFailure = function (){
    if (GetLang()){sayText('Incorrect input. Please enter the 8 digit account number you use for repayment\nPress 0 if you do not have an OAF account\n99) Swahili');}
    else {sayText('Nambari sio sahihi. Tafadhali ingiza nambari 8 za akaunti yako ambayo unatumia kufanya malipo.\nBonyeza 0 kama hauna akaunti ya OAF\n99) English');}
};
var MainMenuText = function(){
    var populateMainMenu = require('./utils/menus/populate-menu/populateMenu');
    var menu = populateMainMenu(state.vars.lang, 140,true);
    if (typeof (menu) == 'string') {
        sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.main_menu = menu;
        state.vars.input_menu = menu;
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        sayText(menu[state.vars.input_menu_loc]);
        state.vars.main_menu = menu[state.vars.input_menu_loc];
        state.vars.input_menu = JSON.stringify(menu);
    }

};
var MainMenuTextWithMsg = function (msg) {
    var populateMainMenu = require('./utils/menus/populate-menu/populateMenu');
    if (msg.length > 50) {
        msg = msg.substr(0, 50);
    }
    var menu = populateMainMenu(state.vars.lang, 140 - (msg.length + 1), true);
    if (typeof (menu) == 'string') {
        sayText(msg + '\n' + menu);
        state.vars.multiple_input_menus = 0;
        state.vars.main_menu = menu;
        state.vars.input_menu = menu;
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        sayText(msg + '\n' + menu[state.vars.input_menu_loc]);
        state.vars.main_menu = menu[state.vars.input_menu_loc];
        state.vars.input_menu = JSON.stringify(menu);
    }
};
var NonClientMenuText = function (){
    var populateMainMenu = require('./utils/menus/populate-menu/populateMenu');
    var menu = populateMainMenu(state.vars.lang, 140,false);
    if (typeof (menu) == 'string') {
        sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        state.vars.main_menu = menu;
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.main_menu = menu[state.vars.input_menu_loc];
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
    }
};
var NonClientMenuTextWithMsg = function (msg) {
    var populateMainMenu = require('./utils/menus/populate-menu/populateMenu');
    if (msg.length > 50) {
        msg = msg.substr(0, 50);
    }
    var menu = populateMainMenu(state.vars.lang, 140 - (msg.length - 1), false);
    if (typeof (menu) == 'string') {
        sayText(msg + '\n' + menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        state.vars.main_menu = menu;
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.main_menu = menu[state.vars.input_menu_loc];
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        sayText(msg + '\n' + menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
    }
};

var PaymentMenuText = function (client){
    var repaid = client.BalanceHistory.length > 0 ? GetRepaid (client, client.BalanceHistory[0].SeasonName) : 0;
    var balance = client.BalanceHistory.length > 0 ? GetBalance(client, client.BalanceHistory[0].SeasonName) : 0;
    if (GetLang()){sayText('You are paying into account number '+client.AccountNumber+' Total Repaid '+repaid+', Bal '+balance+'.Please reply with the amount you want to pay');}
    else {sayText('Unafanya malipo kwa hii akaunti '+client.AccountNumber+' Jumla ya malipo '+repaid+', Salio '+balance+'.Tafadhali weka kiasi unachotaka kulipa');}
};
var CheckBalanceMenuText = function (healthyPathDetails, Overpaid,Season,Credit,Paid,Balance){
    var getHealthyPathMessage = require('../healthy-path/balance/healthyPathOnBalance');
    var balanceMenu = '';
    var healthyPathMessage = '';
    if (GetLang()){
        healthyPathMessage = getHealthyPathMessage(healthyPathDetails.seasonId, healthyPathDetails.countryId, healthyPathDetails.districtId, Credit, Paid, 'en');
        if(Overpaid){
            balanceMenu = Season+':\nPaid: '+Paid+'\nTotal credit: '+Credit+'\nOver payment: '+Balance+ '\n' + healthyPathMessage + '1 - Make payment';
        }else {
            balanceMenu = Season+':\nPaid: '+Paid+'\nTotal credit: '+Credit+'\nRemaining: '+Balance + '\n' + healthyPathMessage +  '1 - Make payment';
        }
    } else{
        healthyPathMessage = getHealthyPathMessage(healthyPathDetails.seasonId, healthyPathDetails.countryId, healthyPathDetails.districtId, Credit, Paid, 'sw');
        if(Overpaid){
            balanceMenu = Season+':\nJumla ya malipo: '+Paid+'\nJumla ya mkopo: '+Credit+'\nMalipo kwa mkopo unaofuata: '+Balance+ '\n' + healthyPathMessage + '1 - Fanya malipo';
        }else {
            balanceMenu = Season+':\nPaid: '+Paid+'\nTotal credit: '+Credit+'\nSalio: '+Balance+ '\n' + healthyPathMessage + '1 - Fanya malipo';
        }
    }
    sayText(balanceMenu);
    var BalanceInfo = 'Balance: '+Balance+ '\nSeason: '+Season+ '\nCredit: '+Credit+ '\nPaid: '+Paid+ '\nOverpaid: '+Overpaid + '\n' + healthyPathMessage;
    call.vars.BalanceInfo = BalanceInfo;
    notifyELK();
};

var TrainingMenuText = function (){
    var trainingsCreateMenu = require('../kenya-trainings-menu/createMenu');
    var lang = GetLang() ? 'en-ke' : 'sw';
    var client = state.vars.client && JSON.parse(state.vars.client);
    var trainingsMenu = trainingsCreateMenu(lang, 'Restricted sites from nutrition training', client);
    var trainingsOptions = trainingsMenu.optionValues;
    var trainingsScreens = trainingsMenu.screens;
    state.vars.trainings_options = JSON.stringify(trainingsOptions);
    state.vars.trainings_screens = JSON.stringify(trainingsScreens);

    state.vars.current_trainings_screens = '1';
    sayText(trainingsScreens[state.vars.current_trainings_screens]);
};

var TrainingMenuNextText = function (){
    var trainingsScreens = JSON.parse(state.vars.trainings_screens);
    var currentTrainingScreen = parseInt(state.vars.current_trainings_screens) + 1;
    if(trainingsScreens[currentTrainingScreen]) {
        state.vars.current_trainings_screens = currentTrainingScreen;
        sayText(trainingsScreens[currentTrainingScreen]);
    }
};

var TrainingPlatSelectText = function (){
    if (GetLang()){sayText('1. SMS\n2. Get a FREE CALL');}
    else {sayText('1. SMS\n2. KUPIGIWA');}
};


var TrainingTriggeredIVRText = function (){
    if (GetLang()){sayText(' You will be called by 0711 082 882.');}
    else {sayText('Utapigiwa moja kwa moja na 0711 082 882.');}
};

var PaymentSuccessText = function (){
    if (GetLang()){sayText('Please confirm the transaction by typing in your MPesa PIN in the pop up that will appear. Thank you');}
    else {sayText('Tafadhali thibitisha malipo yako kwa kubonyeza nambari yako ya siri ya Mpesa. Asante');}
};
var PaymentFailureText = function (){
    if (GetLang()){sayText('An unexpected error occurred, please try again by dialing *689#');}
    else {sayText('Kuna hitilafu ya mitambo. Tafadhali jaribu tena kwa kubonyeza *689#');}
};
var PaymentRetryText = function (){
    if (GetLang()){sayText('Please enter correct amount. Pay 10 KSHs or more.');}
    else {sayText('Tafadhali weka kiasi sahihi. Fanya malipo ya Shillingi kumi (KSHs 10) au zaidi.');}
};
var PrepaymentNotEnrolledText = function(){
    if (GetLang()){sayText('You are not enrolled this season\n1) Back to menu');}
    else {sayText('Hujasajiliwa msimu huu\n1) Rudi kwenye menyu');}
};
var PrepaymentMenuText = function(prepayment, paid){
    console.log('Already paid: '+paid);
    if(prepayment == 'Error'){

        if (GetLang()){sayText('An error occured.\n1) Back to menu');}
        else {sayText('Kosa limetokea.\n1) Rudi kwenye menyu');}
    }
    else{
        var Remaining = Math.max(0,prepayment - paid);
        if (GetLang()){sayText('You have paid KES'+paid +'. Your prepayment balance to qualify is now KES '+Remaining+'\n1) Back to menu');}
        else {sayText('Umelipa KES'+paid +'. Salio lako la malipo ya kufuzu ni KES '+Remaining+'\n1) Rudi kwenye menyu');}
    }
};
var CallMeBackText = function(){
    if (GetLang()){sayText('Please reply with the number you want to be called back on\n1) Use current number\n9) Back to menu');}
    else {sayText('Tafadhali jibu kwa nambari ya simu utakayo pigiwa nayo.\n1) Kutumia nambari unayo tumia sasa\n9) Rudi hadi mwanzo');}
};
var CallMeBackConfirmText = function(){
    if (GetLang()){sayText('You will contacted by our customer service representative within 48 hours. Do not switch off  this phone or place a duplicate request.');}
    else {sayText('Utapokea simu kutoka kwa mhudumu wa one Acre Fund kwa muda wa masaa 48. Usizime simu hii wala kuwasilisha ombi zaidi ya mara moja.');}
};

var LoanNotRepaidText = function(season){
    if (GetLang()){sayText('your loan for '+season+' is not fully repaid\n1) Back to menu');}
    else {sayText('your loan for '+season+' is not fully repaid\n1) Back to menu');}
};
// SHS
var SHSMenuText = function(){
    if (GetLang()){sayText('1) Get Activation Code\n2) Get Unlock Code (100% repaid)\n9) Back to main\n99) Report issue');}
    else {sayText('1) Kupata kodi ya kuwasha taa\n2) Kupata Kodi ya kuwasha taa milele (100% repaid)\n9) Rudi Hadi Mwanzo\n99) Kwa shida Yoyote');}
};
var SHSRegNoOrderText = function(){
    if (GetLang()){sayText('You did not order an SHS this season.\n9) Back to main\n99) Report issue');}
    else {sayText('Hukujiandikisha taa yoyote ya SHS mwaka Huu\n9) Rudi hadi mwanzo\n99) Kwa shida Yoyote');}
};
var SHSSerialText = function(){
    if (GetLang()){sayText('Please enter the serial number.\n9) Back to main');}
    else {sayText('Tafadhali weka nambari ya taa  yako\n9) Rudi hadi mwanzo');}
};
var SHSNotQualifiedText= function(){
    if (GetLang()){sayText('You have not qualified and thus cannot register.\n9) Back to main\n99) Report issue');}
    else {sayText('Hujahitimu na hivyo huwezi kusajili\n9) Rudi hadi mwanzo\n99) Kwa shida Yoyote');}
};
var SHSRegOtherText= function(){
    if (GetLang()){sayText('This SHS is already registered to somebody else\n9) Back to main\n99) Report issue');}
    else {sayText('Taa hii Imesajiliwa na mkulima mwingine\n9) Rudi Hadi Mwanzo\n99) Kwa shida Yoyote');}
};

var SHSTypeText = function(){

    var SHSTypeArray = JSON.parse(state.vars.SHS_Type);
    var SHSTypeMenuText = '';
    var i = 0;

    while (i < SHSTypeArray.length) {
        var MenuNumber = i+1;
        SHSTypeMenuText = SHSTypeMenuText + MenuNumber+') '+ SHSTypeArray[i]+'\n';
        i++;
    }

    if (GetLang()){sayText('Select type:\n'+SHSTypeMenuText+'9) Back to main');}
    else {sayText('Chagua aina ya taa:\n'+SHSTypeMenuText+'9) Rudi Hadi Mwanzo');}
};
var SHSSerialNotValidText = function(){
    if (GetLang()){sayText('Invalid input.\nPlease enter the serial number.\n9) Back to main\n99) Report issue');}
    else {sayText('Nambari sio sahihi:\nTafadhali weka nambari ya taa\n9) Rudi hadi mwanzo\n99) Kwa shida Yoyote');}
};
var SHSActivationCodeText = function(activationcode){
    if (GetLang()){sayText('Thank you. Your Activation code is: '+activationcode+'\n9) Back to main');}
    else {sayText('Asante. Kodi ya kuwasha taa yako ni:'+activationcode+'\n9) Kurudi Hadi Mwanzo');}
};
var SHSUnlockText = function(unlockcode, seasonname){
    if (GetLang()){sayText('You have completed your loan for '+seasonname+'\nYour unlock code is: '+unlockcode+'\n9) Back to main');}
    else {sayText('Umemaliza malipo ya '+seasonname+'\nKodi ya Kufungua taa yako miliele ni: '+unlockcode+'\n9) Rudi hadi mwanzo');}
};
var SHSCodeSMS = function(shscode){
    var SMSText = '';
    if (GetLang()) {SMSText = 'Your solar code is: '+shscode;}
    else {SMSText = 'Kodi ya taa yako ni: '+shscode;}

    project.scheduleMessage({
        message_type: 'service',
        to_number: contact.phone_number,
        start_time_offset: 0,
        service_id: 'SV44cdffa755e06381',
        vars: {content: SMSText}
    });

};
// FAW
var FAWMaxOrderText = function(numberordered){

    console.log('allowed to cancel: '+state.vars.FAWAllowcancel);
    if(state.vars.FAWAllowcancel){
        if (GetLang()){sayText('Sorry, you have already ordered '+numberordered+' pesticide bottles. You are not allowed to order more.\n9) Cancel order');}
        else {sayText('Samahani, umeshatuma ombi la chupa '+numberordered+' za dawa. Hauruhusiwi kuagiza zaidi\n9) Futa agizo');}
    }
    else{
        if (GetLang()){sayText('Sorry, you have already ordered '+numberordered+' pesticide bottles. You are not allowed to order more.\n1) Back to main');}
        else {sayText('Samahani, umeshatuma ombi la chupa '+numberordered+' za dawa. Hauruhusiwi kuagiza zaidi\n1) Rudi mwanzo wa menu');}
    }


};
var FAWInactiveText = function(){
    if (GetLang()){sayText('Orders for Radiant are currently closed. You can buy the pesticide from your agrovet. Remember to use a different pesticide each season');}
    else {sayText('Kuagiza kwa Radiant kumefungwa kwa sasa. Unaweza kununua dawa hii kutoka kwa duka la ukulima. Kumbuka kutumia dawa tofauti kila msimu');}
};

var FAWOrderText = function(remainorders, alreadyordered){
    console.log('allowed to cancel: '+state.vars.FAWAllowcancel);
    var FAWOrderText = '';
    for (var i = 0; i <remainorders; i++) {
        var MenuItem = i+1;
        var Price = MenuItem * FAWUnitPrice;
        if (GetLang()){FAWOrderText = FAWOrderText + MenuItem+ ') ' +MenuItem + ' Bottle - '+ Price+ 'KSH\n';}
        else {FAWOrderText = FAWOrderText + MenuItem+ ') ' +MenuItem + ' Chupa - '+ Price+ 'KSH\n';}
    }
    if(state.vars.FAWAllowcancel){
        if (GetLang()){sayText('Orders already placed: '+alreadyordered+ '\nSelect additional order:\n'+FAWOrderText+ '9) Cancel order');}
        else {sayText('Agizo ulizoshaweka: '+alreadyordered+ '\nChagua kiwango unachotaka kuagiza:\n'+FAWOrderText+ '9) Futa agizo');}
    }
    else{
        if (GetLang()){sayText('Orders already placed: '+alreadyordered+ '\nSelect additional order:\n'+FAWOrderText+ '9) Back to main');}
        else {sayText('Agizo ulizoshaweka: '+alreadyordered+ '\nChagua kiwango unachotaka kuagiza:\n'+FAWOrderText+ '9) Rudi mwanzo wa menu');}
    }
};

var FAWCancelConfirmText = function(CancelAmount){
    var CancelPrice = Number(CancelAmount)*Number(FAWUnitPrice);
    if (GetLang()){sayText('You have just cancelled '+CancelAmount+' bottles of pesticide of Kshs. '+CancelPrice+ '\n9) Back to main');}
    else {sayText('Umefuta agizo la '+CancelAmount+'  ya dawa linaloyogharimu Kshs.'+CancelPrice+ '\n9) Rudi mwanzo wa menu');}
};

var FAWConfirmText = function (order){
    if (GetLang()){sayText('Please confirm of '+ order+ ' bottles.\n1) Confirm\n9) Back to main');}
    else {sayText('Tafadhali Hakikisha ni chupa '+ order+ ' ya dawa.\n1) Hakikisha\n9) Rudi mwanzo wa menu');}
};
var FAWSuccessText = function (order){
    var Credit = order* FAWUnitPrice;
    if (GetLang()){sayText('Thanks for ordering '+ order+ ' bottles. Your FO will deliver the pesticide within a few weeks. An amount of '+Credit+' KSH will be added to your credit.\n9) Back to main');}
    else {sayText('Asante kwa kuagiza chupa '+ order+ '. Mwalimu wako atakuletea dawa zako kwa wiki chache zijazo. Kiasi cha KSH '+Credit+' kitaongezwa kwa mkopo wako.\n9) Rudi mwanzo wa menu');}
};

var FAWCancelOrderText = function(){
    if (GetLang()){sayText('You are allowed to cancel '+ state.vars.FAWCancelAmount+ ' bottles. How many whould you like to cancel?\n9) Back to main');}
    else {sayText('Unakubaliwa kufuta '+ state.vars.FAWCancelAmount+ ' ya dawa. Ungependa kufuta agizo ngapi?\n9) Rudi mwanzo wa menu');}
};

var FAWSuccessSMS = function(order){

    var Credit = order* FAWUnitPrice;
    var SMStext = 'Asante kwa kuagiza chupa '+ order+ '. Mwalimu wako atakuletea dawa zako kwa wiki chache zijazo. Kiasi cha KSH '+Credit+' kitaongezwa kwa mkopo wako.';
    if (GetLang()){SMStext = 'Thanks for ordering '+ order+ ' bottles. Your FO will deliver the pesticide within a few weeks. An amount of '+Credit+' KSH will be added to your credit.';}
    // Please use scheduled message function for PUSH SMSes from the USSD service to make sure that the traffic pops up in the dashboard here: https://telerivet.com/p/0c6396c9/message_stats?cumulative=false&field=count&rollup=day&groups=main.series.service%2Cmain.series.type%2Cmain.series.direction&start_date=6.4.2020&end_date=6.5.2020 This is used for budgetting
    project.scheduleMessage({
        message_type: 'service',
        to_number: contact.phone_number,
        start_time_offset: 0,
        service_id: 'SV6033c380e37b7d11',
        vars: {content: SMStext}
    });

};
var JITTUAccNumNotValidText = function(){
    if (GetLang()){sayText('Account number is not valid. Please try again\n1)Back to menu');}
    else {sayText('Nambari ya akaunti sio sahihi. Tafadhali jaribu tena.\n1) Rudi kwa menu');}
};
var JITTUPrepaymentNotValidText = function(paid,prepayment){
    var remaining = prepayment - paid;
    if (GetLang()){sayText('You do not qualify for a top up, pay at least '+ prepayment +' to qualify. Pay '+ remaining + ' to reach '+ prepayment);}
    else {sayText('Bado haujahitimu kuongeza bidhaa, lipa '+ prepayment +'  kuhitimu. Lipa '+ remaining + ' ili ufikishe '+ prepayment);}
};
var JITBundleSelectText = function(bundleoptions){
    if (bundleoptions.length ===0){
        if (GetLang()) {sayText('No more options available\n9) back to menu');}
        else {sayText('Hakuna chaguzi/bidhaa zingine zinazopatikana.\n9) Rudi kwa menu');}
    }
    else{
        var BundleSelectText = '';
        for (var i = 0; i < bundleoptions.length; i++) {
            var MenuNumber = i+1;
            if (GetLang()) {BundleSelectText = BundleSelectText+ MenuNumber+') '+ bundleoptions[i].nameEN+ ' - '+  bundleoptions[i].price+'\n';}
            else {BundleSelectText = BundleSelectText+ MenuNumber+') '+ bundleoptions[i].nameSW+ ' - '+  bundleoptions[i].price+'\n';}
        }
        if (GetLang()){sayText(BundleSelectText+'\n9) Back to Menu');}
        else {sayText(BundleSelectText+'\n9) Rudi Nyuma');}
    }
};
var JITTUOrderOverviewSMS= function(orderoverview, accountnumber, phonenumber){
    var OrderOverviewText = '';
    if (GetLang()) {OrderOverviewText = 'Orders added to account: '+ accountnumber+':\n';}
    else {OrderOverviewText =  'Bidhaa zilizo ongezwa kwa akauti: '+ accountnumber+': \n';}
    var NumberOrders = orderoverview.length;
    for (var i = 0; i < NumberOrders; i++) {
        if (GetLang()) {
            OrderOverviewText = OrderOverviewText+ orderoverview[i].nameEN+ ' - '+ orderoverview[i].price+'KSH\n';
        }
        else {
            OrderOverviewText = OrderOverviewText+ orderoverview[i].nameSW+ ' - '+ orderoverview[i].price+'KSH\n';
        }
    }
    // Please use scheduled message function for PUSH SMSes from the USSD service to make sure that the traffic pops up in the dashboard here: https://telerivet.com/p/0c6396c9/message_stats?cumulative=false&field=count&rollup=day&groups=main.series.service%2Cmain.series.type%2Cmain.series.direction&start_date=6.4.2020&end_date=6.5.2020 This is used for budgetting
    project.scheduleMessage({
        message_type: 'service',
        to_number: phonenumber,
        start_time_offset: 0,
        service_id: 'SVd95696157d97757d',
        vars: {content: OrderOverviewText}
    });

    return OrderOverviewText;
};
var JITTUShowOrdersText = function(orderoverview){
    var NumberOrders = orderoverview.length;
    console.log('Building order overview text. Number of orders placed: '+NumberOrders);
    var OrderOverviewText = '';
    if (NumberOrders === 0){
        if (GetLang()){sayText('No top up orders placed.');}
        else {sayText('No top up orders placed');}
    }
    else {
        for (var i = 0; i < NumberOrders; i++) {
            if (GetLang()) {OrderOverviewText = OrderOverviewText+ orderoverview[i].nameEN+ ' - '+ orderoverview[i].price+'\n';}
            else {OrderOverviewText = OrderOverviewText+ orderoverview[i].nameSW+ ' - '+ orderoverview[i].price+'\n';}
        }
        if (NumberOrders<JITTUMaxOrders){
            if (GetLang()) {sayText('Orders placed:\n'+ OrderOverviewText+'\n1) Add product\n2) Finish ordering');}
            else {sayText('Bidhaa ulizo agiza:\n'+ OrderOverviewText+ '1) Ongeza bidhaa\n2) Maliza ombi');}
        }
        else{
            if (GetLang()){sayText('Orders placed:\n'+OrderOverviewText+'\n2) Finish ordering');}
            else {sayText('Bidhaa ulizo agiza:\n'+OrderOverviewText+'\n2) Maliza ombi');}
        }
    }
};
var JITTUNotEnrolled = function(){
    if (GetLang()){sayText('Farmer is not enrolled this season. Please try again\n1)Back to menu');}
    else {sayText('Mkulima hajaandikishwa muhula huu. Tafadhali jaribu tena.\n1) Rudi kwa menu');}
};
var JITTUVarietySelectText = function (varieties){
    var varietiestext = '';
    for (var i = 0; i < varieties.length; i++) {
        var menu = i+1;
        varietiestext = varietiestext+menu+') '+varieties[i]+ '\n';
    }
    if (GetLang()){sayText('Select seed variety:\n'+  varietiestext+ '\n9)Back to menu');}
    else {sayText('Chagua mbegu:\n'+ varietiestext+ 'n\n9) Rudi kwa menu');}
};
var JITTU_JITEClientText = function(){
    if (GetLang()){sayText('This farmer is registered through JIT enrollement. They cannot top up.\n1)Back to menu');}
    else {sayText('Mkulima huyu amesajiliwa kupitia JiT. Hawezi ongeza bidhaa zaidi.\n1) Rudi kwa menu');}
};
var JITTUOrderConfrimText = function(bundlename,variety){
    if (GetLang()){sayText('Top up with '+bundlename+' and '+ variety+'.\n1) Confrim\n9) Cancel');}
    else {sayText('Umeogeza '+bundlename+' na '+ variety+'.\n1) Thibitisha\n9) Futa');}
};
var JITTUOrderNoVarConfrimText = function(bundlename){
    if (GetLang()){sayText('Top up with '+bundlename+'.\n1) Confrim\n9) Cancel');}
    else {sayText('Top up with '+bundlename+'.\n1) Confrim\n9) Cancel');}
};
var JITTUOrderedText = function (){
    if (GetLang()){sayText('Thank you for placing your Just in Time Top-up order.');}
    else {sayText('Asante kwa kutuma maombi yako ya Just in Time Top-up.');}
};
// JIT E
var JITEAccNumNotValidText = function(){
    if (GetLang()){sayText('Not valid\nPlease reply with the account number of the farmer\n0) For new client.');}
    else {sayText('Sio sahihi\nTafadhali jibu na nambari ya akaunti ya mkulima\n0) kwa mkulima mgeni');}
};
var JITEAccNumAlreadyEnrolledText = function(){
    if (GetLang()){sayText('This accountnumber already belongs to an enrolled client.\n1)Go back to main menu');}
    else {sayText('Nambari hii ya akaunti ni ya mteja aliyeandikishwa.\n1) Rudi kwenye menu kuu');}
};
var JITEFirstNameText = function (){
    if (GetLang()){sayText('Please reply with the first name of the member you want to add to your group');}
    else {sayText('Tafadhali jibu na jina ya kwanza ya memba unayetaka kuongeza kwa kikundi chako');}
};
var JITELastNameText = function (){
    if (GetLang()){sayText('Please reply with the second name of the member you want to add to your group');}
    else {sayText('Tafadhali jibu na jina ya pili ya memba unayetaka kuongeza kwa kikundi chako');}
};
var JITENationalIDText = function(){
    if (GetLang()){sayText('What is their national ID?');}
    else {sayText('Namba yao ya kitambulisho ni gani?');}
};
var JITEBundleSelectText = function(bundleoptions){
    if (bundleoptions.length ===0){
        if (GetLang()) {sayText('No more options available\n9) back to menu');}
        else {sayText('No more options available\n9) back to menu');}
    }
    else{
        var BundleSelectText = '';
        for (var i = 0; i < bundleoptions.length; i++) {
            var MenuNumber = i+1;
            if (GetLang()) {BundleSelectText = BundleSelectText+ MenuNumber+') '+ bundleoptions[i].nameEN+ ' - '+  bundleoptions[i].price+'\n';}
            else {BundleSelectText = BundleSelectText+ MenuNumber+') '+ bundleoptions[i].nameSW+ ' - '+  bundleoptions[i].price+'\n';}
        }
        if (GetLang()){sayText('Select maize acreage.\n'+BundleSelectText+'\n9) Back to Menu');}
        else {sayText('Select maize acreage.\n'+BundleSelectText+'\n9) Back to Menu');}
    }
};
var JITENationalInvalidText = function(){
    if (GetLang()){sayText('Invalid entry.\nPlease enter a valid national id.');}
    else {sayText('Usajili usiosahihi\nTafadhali weka nambari sahihi ya kitambulisho');}
};
var JITEAlreadyOrderedText = function(){
    if (GetLang()){sayText('This person already placed an order.\n1) Back to menu');}
    else {sayText('Mtu huyu tayari ameweka agizo/ ameitisha bidhaa\n1) Rudi kwa menu');}
};
var JITEOrderConfrimText = function(bundlename,variety){
    if (GetLang()){sayText('The client has enrolled with '+bundlename+' and '+ variety+'.\nReply with their Phonenumber to confrim\n9) Cancel');}
    else {sayText('Mkulima amejisajili na '+bundlename+' na '+ variety+'.\nWeka nambari ya simu ya mkulima ili kudhibitisha maombi\n9) Futa maombi');}
};
var JITEOrderConfrimSMS = function(phonenumber, bundlename,variety){
    var SMSText = '';
    if (GetLang()){SMSText='Thanks for ordering '+bundlename+ ' of seed type '+ variety+'. Make sure you pay KSH 500 qualification amount to receive input on input delivery day.';}
    else {SMSText='Asante kwa kujisajili na '+bundlename+ ' na '+ variety+'. Hakikisha umelipa shilingi 500 ilikupokea bidhaa siku yakupokea pembejeo.';}
    // Please use scheduled message function for PUSH SMSes from the USSD service to make sure that the traffic pops up in the dashboard here: https://telerivet.com/p/0c6396c9/message_stats?cumulative=false&field=count&rollup=day&groups=main.series.service%2Cmain.series.type%2Cmain.series.direction&start_date=6.4.2020&end_date=6.5.2020 This is used for budgetting
    project.scheduleMessage({
        message_type: 'service',
        to_number: phonenumber,
        start_time_offset: 0,
        service_id: 'SVd95696157d97757d',
        vars: {content: SMSText}
    });

};
var JITEOrdeCloseText = function(){
    if (GetLang()){sayText('Thanks for enrolling with One Acre Fund through Just in Time.');}
    else {sayText('Asante kwa kujisajili na One acre Fund kupitia Just in Time.');}
};
// FO Locator
var CallMeBackFOLOcatorConfirmText = function(){
    if (GetLang()){sayText('Thank you for your interest to join One Acre Fund. We will be calling you back in 24 hours');}
    else {sayText('Asante kwa kuonesha nia ya kujisajili na OAF. Utapokea simu kwa muda usio zidi masaa ishirini na nne (24hrs)');}

};
var FOLocatorRegionText = function (){
    if (GetLang()){sayText('To learn more we will connect you with a staff near you. Select Province\n1) Central\n2) Nyanza\n3) Rift Valley\n4) Western\n0)  My province is not in the list');}
    else {sayText('Kwa maelezo zaidi tutakuelekeza kwa mfanya kazi aliye karibu nawe. Chagua wilaya.\n1) Central\n2) Nyanza\n3) Rift Valley\n4) Western\n0) Wilaya yangu haipo hapa');}
};
var LocationNotKnownText = function(){
    if (GetLang()){sayText('Sorry OAF does not work in your area');}
    else {sayText('Samahani, OAF haiko kwenye eneo lako');}
};
var FOLocatorCountyText = function(LocMenu){
    if (GetLang()){sayText('Which county are you in?\n'+LocMenu+'\n0) My county is not listed');}
    else {sayText('Chagua Kata yako\n'+LocMenu+'\n#) Kata yangu haiko kwenye orodha');}
};
var FOLocatorSubCountyText = function(LocMenu){
    if (GetLang()){sayText('Which sub county are you in?\n'+LocMenu+'\n0) My subcounty is not listed');}
    else {sayText('Chagua Kataa Ndogo yako\n'+LocMenu+'\n#) Kataa Ndogo yangu haiko kwenye orodha');}
};
var FOLocatorWardText = function(LocMenu){
    if (GetLang()){sayText('Which Ward are you in?\n'+LocMenu+'\na) Go to OAF Sites\n0) My ward is not listed');}
    else {sayText('Chagua Wadi yako\n'+LocMenu+'\na) Chagua OAF site\n#) Wadi yangu haiko kwenye orodha');}
};
var FOLocatorSiteText = function(LocMenu){
    if (GetLang()){sayText('Which ONE ACRE FUND site are you in?\n'+LocMenu+'\n0) My site is not listed');}
    else {sayText('Chagua site yako\n'+LocMenu+'\n#) Site yangu haiko kwenye orodha');}
};
var FOLocatorConfirmText = function(){
    if (GetLang()){sayText('Your field officer is '+ state.vars.FOName+ '.Do you want to reach out to the field officer\n1) Yes\n2) No - exit menu');}
    else {sayText('Ungependa kuwasiliana na Afisa wetu wa nyanjani?\n1) Yes\n2) No - exit menu');}
};
var FOLocatorConfirmDeclineText = function(){
    if (GetLang()){sayText('Thank you.');}
    else {sayText('Asante');}
};
var FOLocatorConfirmSuccessText = function(){
    if (GetLang()){sayText('One Acre Fund contact person details have been sent to you. If you have any questions call our toll free line at 080 0723355');}
    else {sayText('Utapokea ujumbe kutoka One Acre Fund ulio na jina na nambari ya simu ya agenti wetu. Piga simu ukiwa na swali lolote kwa 080 0723355');}
};
var FOLocatorFarmerSMS = function(){
    if (GetLang()){return state.vars.FOName+ ' is your One Acre Fund contact person. Their number is '+state.vars.FOPN;}
    else {return state.vars.FOName+' ndiye afisa wa nyanjani wa One Acre Fund. Nambari yake ya simu ni '+state.vars.FOPN;}
};
var FOLocatorFOSMS = function(){
    return 'Tafadahli wasiliana na '+contact.phone_number+ ' ili ajiandikishe na One Acre Fund';
};
// INSURANCE
var InsuranceMenuText = function(){
    if (GetLang()){sayText('1) View NHIF Accredited Hospital\n9) Back to main');}
    else {sayText('1) Angalia Hospitali yako iliyoidhinishwa na NHIF\n9) Rudi mwanzo wa menu');}
};

var HospitalRegionText = function(){
    if (GetLang()){sayText('Please choose your region:\n1) Central\n2) Coast\n3) Eastern\n4) Nairobi\n5) North Eastern\n6) Nyanza\n7) Rift Valley\n8) Western');}
    else {sayText('Tafadhali chagua mkoa wako:\n1) Central\n2) Coast\n3) Eastern\n4) Nairobi\n5) North Eastern\n6) Nyanza\n7) Rift Valley\n8) Western');}
};

//Staff Menu
var StaffMenuText = function(){
    sayText('1) Report Unexpected Absence\n2)Report Tablet issue');
    // sayText("1) Report Unexpected Absence\n2)Report Tablet issue \n3) Site enrollment, site repayment and  delivery issues");
};
var StaffPayrollText = function(){
    sayText('Please enter you 5 digit payroll ID');
};
var StaffTabletIssueText = function(){
    var Text = 'Affected part?\n1) FS App\n2) ME App\n3) G suite\n4)Tablet hardware\n5) Tablet system down CE support';
    state.vars.IssueLevel2Ques = Text;
    sayText(Text);
};
var StaffFSAppIssueText = function(){
    var Text = '1) Log in Issue\n2)Wrong/Missing Clients/Payments\n3) CRPR Data Not Updating\n4)Configure with google\n5)Displays error message';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};
var StaffMEAppIssueText = function(){
    var Text = '1) Incorrect Input Bundles/Pricing\n2) App missing\n3) Displays error message\n4)Cannot select site/district)\n5)Cannot Sync/no Button';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};
var StaffGSuiteIssueText = function(){
    var Text = '1) G Suite Gmail/Chrome/Google play services stopping\n2) Forms requiring permission to open\n3) Gmail password reset\n4) Not receiving emails';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};
var StaffTabletHardwareIssueText = function(){
    var Text = '1) Tablet/accessory physical Damage\n2) Tablet Won\'t Charge or power\n3) Stolen tablet/tablet accessory';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};
var StaffTabletDownIssueText = function(){
    var Text = '1) Need report via email\n2) FO/FM Promoted \n3) Data bundle Expired/Runs Out\n4) Tablet Network Issues\n5) FO/FM Transferring\n6) Have no tablet';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};

var StaffRosterIssueText = function(){
    var Text = 'What Roster issue are you experiencing?\n1) Site repayments issue\n2) Site delivery issue\n3) Site enrollment issue';
    state.vars.IssueLevel2Ques = Text;
    sayText(Text);
};

var StaffSiteRepayIssueText = function(){
    var Text = '1) Track missing payments\n2) Payment transfer';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};

var StaffSiteDeliveryIssueText = function(){
    var Text = '1) Enrolled clients missing on IDS\n2) Missing inputs\n3) Wrong inputs';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};

var StaffTabletRosterText = function(){
    var Text = '1) Enrollment app not syncing\n2) Wrongly banned group\n3) Wrongly dropped group\n4) GL change reques';
    state.vars.IssueLevel3Ques = Text;
    sayText(Text);
};

var StaffIssueSuccessText = function(){
    sayText('Thank you for reaching out, you will be contacted by our customer representative via this phone number, be available on call.');
};
var StaffDaySelectText = function(){
    sayText('For which day are you reporting your first day of absense?\n1) Today\n2) Tomorrow\n3) Yesterday\n0) Cancel');
};
var StaffDayAmountText = function(){
    sayText('For how many days do you expect to be absent from work?\n1) 1 day\n2) 2 days\n3) 3 days\n4) 4 days or more\n0) Cancel');
};
var StaffConfrimAbsenceText = function(name){
    sayText('Thank you '+name+' for reporting your work absence. You will receive an email confirmation shortly with further instructions. We wish you well.');
};
var StaffCallForAbsenceText = function(){
    sayText('For absences of more than 3 days, notify your manager directly or an HR representative through the Staff Support Line at 800 720 377. We wish you well.');
};

var StaffConfrimAbsenceEmail = function(email, firstname, startday, amount){
    var startdaydesc = 'Today';
    if (startday == 2){startdaydesc = 'Yesterday';}
    else if (startday == 3){startdaydesc = 'Tomorrow';}
    var subject = 'Absence request received';
    var body = 'Hello '+firstname+'\n\nThank you for using our USSD Staff Menu to report your unexpected absence from work, beginning '+startdaydesc+' and expected to last '+amount+' days. Per HR policy, you must also alert your manager of your absence as soon as possible, and submit a Leave Form upon return to work.\n\nIf you have any questions or concerns about this or any other HR-related matter, please don\'t hesitate to call the OAF Staff Support Line at 0800 720 377.\n\nTogether in Service,\n\nKenya HR';
    sendEmail(email, subject, body);
};
var registrationMenu= function(){
    if (GetLang()){sayText('Please reply with the account number of the farmer\n0) For new client.');}
    else {sayText('Tafadhali jibu na nambari ya akaunti ya mkulima\n0) kwa mkulima mgeni');}
};


// Start logic flow
global.main = function () {
    state.vars.English = false;
    LogSessionID();
    SplashMenuText();
    promptDigits('SplashMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
};

var langWithEnke = GetLang() ? 'en-ke' : 'sw';

// load input handlers
dukaLocator.registerDukaLocatorHandlers({lang: GetLang() ? 'en' : 'sw'});
transactionHistory.registerHandlers();
clientRegistration.registerHandlers();
justInTime.registerHandlers();
groupRepaymentsModule.registerGroupRepaymentHandlers({lang: GetLang() ? 'en' : 'sw', main_menu: state.vars.main_menu, main_menu_handler: 'MainMenu'});
dukaClient.registerInputHandlers(GetLang() ? 'en-ke' : 'sw', service.vars.duka_clients_table);
warrantyExpiration.registerHandlers();
seedGerminationIssues.registerInputHandlers(langWithEnke, service.vars.seed_germination_issues_table);
contactCallCenter.registerInputHandlers(GetLang() ? 'en-ke' : 'sw');
shs.registerHandlers();
sbccModule.registerInputHandlers({lang: GetLang() ? 'en' : 'sw', backMenu: NonClientMenuText});
kenyaImpactTrainings.registerInputHandlers(TrainingMenuText, GetLang() ? 'en' : 'sw');
function reduceClientSize(client) {
    var cloned = _.clone(client);
    cloned.AccountHistory = client.AccountHistory.slice(0,3);
    cloned.BalanceHistory = client.BalanceHistory.slice(0,3);
    return cloned;
}
addInputHandler('SplashMenu', function(SplashMenu) {
    LogSessionID();
    InteractionCounter('SplashMenu');
    ClientAccNum = SplashMenu;
    if (SplashMenu == '99'){
        ChangeLang();
        SplashMenuText();
        promptDigits('SplashMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
    }
    else if (SplashMenu == '0'){
        NonClientMenuText();
        promptDigits('NonClientMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else if (SplashMenu == '9'){
        StaffPayrollText();
        promptDigits('StaffPayRoll', {submitOnHash: true, maxDigits: 5, timeout: 5});
    }
    else {
        var creditOfficerDetails = isCreditOfficer(ClientAccNum, service.vars.credit_officers_table);
        if (RosterClientVal(ClientAccNum)){
            console.log('SuccessFully Validated against Roster');
            client = RosterClientGet(ClientAccNum);
            state.vars.client_json = JSON.stringify(reduceClientSize(client));
            // check for group leader
            var isGroupLeader = checkGroupLeader(client.DistrictId, client.ClientId);
            state.vars.isGroupLeader = isGroupLeader;
            state.vars.client = JSON.stringify(TrimClientJSON(client));
            call.vars.client = JSON.stringify(TrimClientJSON(client));
            call.vars.AccNum = ClientAccNum;
            notifyELK();
            state.vars.account_number = client.AccountNumber;
            MainMenuText(client);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
        }
        else if(creditOfficerDetails) {
            dukaClient.start(GetLang() ? 'en-ke' : 'sw', creditOfficerDetails);
        }
        else{
            console.log('account number not valid');
            SplashMenuFailure();
            promptDigits('SplashMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
        }
    }
});

addInputHandler('NonClientMenu', function(input) {
    LogSessionID();
    InteractionCounter('NonClientMenu');
    var sessionMenu =JSON.parse(state.vars.sessionMenu);
    if (state.vars.multiple_input_menus) {
        if (input == 44 && state.vars.input_menu_loc > 0) {
            state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
            sayText(menu);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
            return null;
        }
        else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
            state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
            menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
            sayText(menu);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
            return null;
        }
        else if (input == 44 && state.vars.input_menu_loc == 0) {
            MainMenuText(client);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
            return null;
        }
    }
    if (input == 99){
        ChangeLang();
        NonClientMenuText();
        promptDigits('NonClientMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else if (!sessionMenu[input - 1]) {
        NonClientMenuTextWithMsg('Incorrect input');
        promptDigits('NonClientMenu', { submitOnHash: true, maxDigits: 2, timeout: 5 });
    }
    else if(sessionMenu[input-1].option_name == 'find_oaf_contact'){
        FOLocatorRegionText();
        promptDigits('FOLocRegion', {submitOnHash: true, maxDigits: 8, timeout: 5});
    }
    else if(sessionMenu[input-1].option_name == 'trainings'){
        kenyaImpactTrainings.start( GetLang() ? 'en' : 'sw', 'TrainingSelect');
    }
    else if(sessionMenu[input-1].option_name == 'locate_oaf_duka') {
        dukaLocator.startDukaLocator({lang: GetLang() ? 'en' : 'sw'});
    } else if(sessionMenu[input-1].option_name === 'report_seed_quality') {
        //start the seed germination issues
        seedGerminationIssues.start(langWithEnke);
    }else if(sessionMenu[input-1].option_name === 'contact_call_center'){
        contactCallCenter.start(GetLang() ? 'en-ke' : 'sw', false);
    } else if (sessionMenu[input-1].option_name === 'sbcc') {
        sbccModule.startSBCC({lang: GetLang() ? 'en' : 'sw', backMenu: NonClientMenuText});
    } else{
        NonClientMenuText();
        promptDigits('NonClientMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
});
addInputHandler('MainMenu', function(SplashMenu){
    LogSessionID();
    InteractionCounter('MainMenu');
    client = JSON.parse(state.vars.client);
    var sessionMenu =JSON.parse(state.vars.sessionMenu);
    if (state.vars.multiple_input_menus) {
        if (SplashMenu == 44 && state.vars.input_menu_loc > 0) {
            state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
            var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
            sayText(menu);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
            return null;
        }
        else if (SplashMenu == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
            state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
            menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
            sayText(menu);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
            return null;
        }
        else if (SplashMenu == 44 && state.vars.input_menu_loc == 0) {
            MainMenuText(client);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
            return null;
        }
    }
    if (sessionMenu == '99'){
        ChangeLang();
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
    }
    else if (!sessionMenu[SplashMenu - 1]) {
        MainMenuTextWithMsg('Incorrect input', client);
        promptDigits('MainMenu', { submitOnHash: true, maxDigits: 8, timeout: 5 });
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'make_payment'){
        client = JSON.parse(state.vars.client);
        PaymentMenuText (client);
        promptDigits('PaymentAmount', {submitOnHash: true, maxDigits: 5, timeout: 5});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'register_client'){
        state.vars.canEnroll = false;
        registrationMenu();
        promptDigits('registrationHandler', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'register_enroll_client'){
        state.vars.canEnroll = true;
        registrationMenu();
        promptDigits('registrationHandler', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'top_up'){
        justInTime.start(client.AccountNumber, 'KE',state.vars.lang);
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'trainings'){
        TrainingMenuText();
        promptDigits('TrainingSelect', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'transaction_history'){
        transactionHistory.start(client.AccountNumber, 'ke',state.vars.main_menu,'MainMenu');
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'prepayment_amount'){
        if(client.BalanceHistory[0].SeasonName == CurrentSeasonName){
            var paid = client.BalanceHistory[0].TotalRepayment_IncludingOverpayments;
            PrepaymentMenuText(GetPrepaymentAmount(client),paid);
        }
        else {
            PrepaymentNotEnrolledText();
        }
        promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'presticide_order'){
        if( FAWActive(client.DistrictName)&&EnrolledAndQualified(client)){
            var OrdersPlaced = FAWOrdersPlaced(client.AccountNumber);
            if (OrdersPlaced<FAWMaxOrders){
                var RemainOrders = FAWMaxOrders - OrdersPlaced;
                state.vars.FAWRemaining = RemainOrders;
                FAWOrderText(RemainOrders, OrdersPlaced);
                promptDigits('FAWOrder', {submitOnHash: true, maxDigits: 1, timeout: 5});
            }
            else {
                FAWMaxOrderText(OrdersPlaced);
                if (state.vars.FAWAllowcancel){
                    promptDigits('FAWCancel', {submitOnHash: true, maxDigits: 1, timeout: 5});
                }
                else{promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});}
            }
        }
        else {
            FAWInactiveText();
            promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }

    }
    else if(sessionMenu[SplashMenu-1].option_name == 'solar'){
        //SHSMenuText();
        //promptDigits('SolarMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
        shs.start(state.vars.client, 'KE',state.vars.lang,state.vars.isGroupLeader,state.vars.main_menu,'MainMenu');

    }   
    else if(sessionMenu[SplashMenu-1].option_name == 'insurance'){
        InsuranceMenuText();
        promptDigits('InsuranceMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'contact_call_center'){
        contactCallCenter.start(GetLang() ? 'en-ke' : 'sw', true);
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'locate_oaf_duka'){
        dukaLocator.startDukaLocator({lang: GetLang() ? 'en' : 'sw'});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'view_group_repayment'){
        // view repayment information
        groupRepaymentsModule.startGroupRepayments({lang: GetLang() ? 'en' : 'sw'});
    }
    else if(sessionMenu[SplashMenu-1].option_name == 'maize_recommendation'){
        // start the maize recommendation
        var maizeRecommendation = require('../maize-recommendation/triggerService');
        var lang;
        if(GetLang()) {
            lang = 'en-ke';
        } else {
            lang = 'sw';
        }
        maizeRecommendation(lang, project.vars.maize_recommendation_service_id);
    }
    else if (sessionMenu[SplashMenu - 1].option_name == 'warranty_expiration') {
        warrantyExpiration.start(client.GlobalClientId, state.vars.lang);
    }
    else if(sessionMenu[SplashMenu - 1].option_name ===  'report_seed_quality') {
        //start the seed germination issues
        seedGerminationIssues.start(langWithEnke);
    }
    else if(sessionMenu[SplashMenu - 1].option_name ===  'fo_details') {
        foDetails.start(langWithEnke);
    }
    else{
        var arrayLength = client.BalanceHistory.length;
        var Balance = '';
        var Season = '';
        var Overpaid = false;
        var Credit = '';
        var Paid = '';
        for (var i = 0; i < arrayLength; i++) {
            if (client.BalanceHistory[i].Balance>0){
                Season = client.BalanceHistory[i].SeasonName;
                Paid = client.BalanceHistory[i].TotalRepayment_IncludingOverpayments;
                Balance = client.BalanceHistory[i].Balance;
                Credit = client.BalanceHistory[i].TotalCredit;
            }
        }
        if (Balance === ''){
            for (var j = 0; j < arrayLength; j++) {
                if (client.BalanceHistory[j].TotalRepayment_IncludingOverpayments>0){
                    Paid = client.BalanceHistory[j].TotalRepayment_IncludingOverpayments;
                    Balance = client.BalanceHistory[j].Balance;
                    Credit = client.BalanceHistory[j].TotalCredit;
                    Season = client.BalanceHistory[j].SeasonName;
                    j = 99;
                    Overpaid = true;
                }
            }
        }
        var mostRecentSeason = client.BalanceHistory[0];
        var healthyPathDetails = {
            countryId: client.CountryId,
            districtId: client.DistrictId
        };
        if (mostRecentSeason) {
            healthyPathDetails.seasonId = mostRecentSeason.SeasonId;
        }
        CheckBalanceMenuText (healthyPathDetails, Overpaid,Season,Credit,Paid,Balance);
        promptDigits('ContinueToPayment', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('BackToMain', function() {
    LogSessionID();
    InteractionCounter('BackToMain');
    var client = JSON.parse(state.vars.client);
    MainMenuText (client);
    promptDigits('MainMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
});
addInputHandler('ContinueToPayment', function() {
    LogSessionID();
    InteractionCounter('ContinueToPayment');
    client = JSON.parse(state.vars.client);
    PaymentMenuText (client);
    promptDigits('PaymentAmount', {submitOnHash: true, maxDigits: 5, timeout: 5});

});
addInputHandler('PaymentAmount', function(PaymentAmount) {
    LogSessionID();
    InteractionCounter('PaymentAmount');
    if (PaymentAmount >= 10 && PaymentAmount < 70000){
        client = JSON.parse(state.vars.client);

        if (isNaN(parseInt(PaymentAmount))){
            console.log('Skip trim, result is NaN');
        }
        else{
            call.vars.PaymentAmount = parseInt(PaymentAmount);
            notifyELK();
            console.log('trimmed payment amount to number');
        }

        if (RosterColRequest (client.AccountNumber,PaymentAmount)){
            call.vars.ColStatus = 'Success';
            PaymentSuccessText();
            call.vars.UpdateReceived = 'NO';
            notifyELK();
            hangUp();
        }
        else {
            call.vars.ColStatus = 'Failed';
            notifyELK();
            PaymentFailureText();
            slackLogger.log(
                '*KE USSD Collection request failure*\n'+ 'Acc num: '+client.AccountNumber+'\nAmount: '+ PaymentAmount+ '\nPhonenumber: '+call.from_number
            );
            hangUp();
        }
    }
    else{
        PaymentRetryText();
        promptDigits('PaymentAmount', {submitOnHash: true, maxDigits: 5, timeout: 5});
    }
});
addInputHandler('FOLocRegion', function(Region) {
    LogSessionID();
    InteractionCounter('FOLocRegion');
    LocationNotKnown(Region);
    if (Region ==1 || Region == 2 || Region == 3 || Region == 4){
        var LocTable = project.getOrCreateDataTable('FO_Locator_Counties');
        var CountyList = LocTable.queryRows({vars: {'regionid': Region}});
        var CountyArray = [];
        while (CountyList.hasNext()) {
            var CountyRow = CountyList.next();
            var Location = {
                'Name': CountyRow.vars.countyname,
                'ID': CountyRow.vars.countyid,
                'Menu': CountyRow.vars.countyid.substring(2)
            };
            CountyArray.push(Location);
        }
        CountyArray.sort(function(a, b){
            return a.Menu-b.Menu;
        });
        state.vars.LocArray = JSON.stringify(CountyArray);
        var LocMenu = '';
        for (var i = MenuCount; i < CountyArray.length; i++) {
            var MenuText =LocMenu + CountyArray[i].Menu+ ') '+ CountyArray[i].Name+'\n';
            if(MenuText.length < 65){LocMenu = MenuText;}
            else{
                MenuCount = i;
                state.vars.MenuCount = i;
                state.vars.MenuNext = true;
                if (GetLang()){LocMenu= LocMenu+'N) Next';}
                else {LocMenu= LocMenu+'n) Ukurasa Ufwatao';}
                i = 9999;
            }
        }
        state.vars.LocMenu = LocMenu;
        FOLocatorCountyText(state.vars.LocMenu);
        promptDigits('FOLocCounty', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else{
        FOLocatorRegionText();
        promptDigits('FOLocRegion', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('FOLocCounty', function(County) {
    LogSessionID();
    InteractionCounter('FOLocCounty');
    LocationNotKnown(County);
    var NextSelected = FOLocatorNextSelect(County);
    if (state.vars.MenuNext && NextSelected){
        var LocMenu = LocationNext();
        FOLocatorCountyText(LocMenu);
        promptDigits('FOLocCounty', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else {
        var  LocValid = false;
        var CountyArray = JSON.parse(state.vars.LocArray);
        var CountyID = '';
        for (var i = 0; i < CountyArray.length; i++) {
            if (CountyArray[i].Menu == County) {
                LocValid = true;
                console.log('FoLocation Valid');
                CountyID = CountyArray[i].ID;
            }
        }
        if (LocValid){
            LocMenu = '' ;
            var LocTable = project.getOrCreateDataTable('FO_Locator_SubCounties');
            var SubCountyList = LocTable.queryRows({vars: {'countyid': CountyID}});
            var SubCountyArray = [];
            while (SubCountyList.hasNext()) {
                var SubCountyRow = SubCountyList.next();
                var Location = {
                    'Name': SubCountyRow.vars.subcountyname,
                    'ID': SubCountyRow.vars.subcountyid,
                    'Menu': SubCountyRow.vars.subcountyid.substring(CountyID.length+1)
                };
                SubCountyArray.push(Location);
            }
            SubCountyArray.sort(function(a, b){return a.Menu-b.Menu;});
            state.vars.LocArray = JSON.stringify(SubCountyArray);
            LocMenu = '';
            MenuCount = 0;
            for ( i = MenuCount; i < SubCountyArray.length; i++) {
                var MenuText = LocMenu + SubCountyArray[i].Menu+ ') '+ SubCountyArray[i].Name+'\n';
                if(MenuText.length < 65){LocMenu = MenuText;}
                else{
                    MenuCount = i;
                    state.vars.MenuCount = i;
                    state.vars.MenuNext = true;
                    if (GetLang()){LocMenu = LocMenu+'N) Next';}
                    else {LocMenu= LocMenu+'n) Ukurasa Ufwatao';}
                    i = 9999;
                }
            }
            state.vars.LocMenu = LocMenu;
            FOLocatorSubCountyText(state.vars.LocMenu);
            promptDigits('FOLocSubCounty', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
        else {
            FOLocatorCountyText(state.vars.LocMenu);
            promptDigits('FOLocCounty', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
    }
});
addInputHandler('FOLocSubCounty', function(SubCounty) {
    LogSessionID();
    InteractionCounter('FOLocSubCounty');
    LocationNotKnown(SubCounty);
    var NextSelected = FOLocatorNextSelect(SubCounty);
    if (state.vars.MenuNext &&  NextSelected){
        var LocMenu = LocationNext();
        FOLocatorSubCountyText(LocMenu);
        promptDigits('FOLocSubCounty', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else {
        var LocValid = false;
        var SubCountyArray = JSON.parse(state.vars.LocArray);
        var SubCountyID = '';
        for (var i = 0; i < SubCountyArray.length; i++) {
            if (SubCountyArray[i].Menu == SubCounty) {
                LocValid = true;
                SubCountyID = SubCountyArray[i].ID;
                state.vars.SubCountyID = SubCountyArray[i].ID;
            }
        }
        if (LocValid){
            LocMenu = '';
            var LocTable = project.getOrCreateDataTable('FO_Locator_Wards');
            var WardList = LocTable.queryRows({vars: {'subcountyid': SubCountyID}});
            var WardArray = [];
            while (WardList.hasNext()) {
                var WardRow = WardList.next();
                var Location = {
                    'Menu': WardRow.vars.wardid.substring(SubCountyID.length+1),
                    'Name': WardRow.vars.wardname,
                    'ID': WardRow.vars.wardid
                };
                WardArray.push(Location);
            }
            WardArray.sort(function(a, b){return a.Menu-b.Menu;});
            state.vars.LocArray = JSON.stringify(WardArray);
            LocMenu = '';
            MenuCount = 0;
            for (var j = MenuCount; j < WardArray.length; j++) {
                var MenuText =LocMenu + WardArray[j].Menu+ ') ' + WardArray[j].Name+'\n';
                if(MenuText.length < 65){LocMenu = MenuText;}
                else{
                    MenuCount = j;
                    state.vars.MenuCount = j;
                    state.vars.MenuNext = true;
                    if (GetLang()){LocMenu= LocMenu+'N) Next';}
                    else {LocMenu = LocMenu+'n) Ukurasa Ufwatao';}
                    j = 9999;
                }
            }
            state.vars.LocMenu = LocMenu;
            FOLocatorWardText(state.vars.LocMenu);
            promptDigits('FOLocWard', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
        else {
            FOLocatorSubCountyText(state.vars.LocMenu);
            promptDigits('FOLocSubCounty', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
    }
});
addInputHandler('FOLocWard', function(Ward) {
    LogSessionID();
    InteractionCounter('FOLocWard');
    LocationNotKnown(Ward);
    var LocValid = false;
    var NextSelected = FOLocatorNextSelect(Ward);
    if (state.vars.MenuNext && NextSelected){
        var LocMenu = LocationNext();
        FOLocatorWardText(LocMenu);
        promptDigits('FOLocWard', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else {
        var WardArray = JSON.parse(state.vars.LocArray);
        var LocID = '';
        for (var j = 0; j < WardArray.length; j++) {
            if (WardArray[j].Menu == Ward) {
                LocValid = true;
                LocID = WardArray[j].ID;
                state.vars.FOLocatorWardName = WardArray[j].Name;
            }
        }
        if (LocValid || Ward.toLowerCase() == 'a'|| Ward =='*'){
            LocMenu = '';
            var LocTable = project.getOrCreateDataTable('FO_Locator_Sites');
            if (Ward.toLowerCase() == 'a'|| Ward =='*'){
                var SiteList = LocTable.queryRows({vars: {'subcountyid': state.vars.SubCountyID}});
            }
            else{SiteList = LocTable.queryRows({vars: {'wardid': LocID}});}
            var SiteArray = [];
            while (SiteList.hasNext()) {
                var SiteRow = SiteList.next();
                var menu = '';
                if (Ward.toLowerCase() == 'a'|| Ward =='*'){menu =SiteRow.vars.siteid.substring(SiteRow.vars.subcountyid.length+1).replace('.', '');}
                else{menu =SiteRow.vars.siteid.substring(SiteRow.vars.wardid.length+1);}
                var Location = {
                    'Menu': menu,
                    'Name': SiteRow.vars.sitename,
                    'ID': SiteRow.vars.siteid
                };
                SiteArray.push(Location);
            }
            SiteArray.sort(function(a, b){return a.Menu-b.Menu;});
            state.vars.LocArray = JSON.stringify(SiteArray);
            LocMenu = '';
            MenuCount = 0;
            for (var i = MenuCount; i < SiteArray.length; i++) {
                var MenuText =LocMenu + SiteArray[i].Menu+ ') ' + SiteArray[i].Name+'\n';
                if(MenuText.length < 65){LocMenu = MenuText;}
                else{
                    MenuCount = i;
                    state.vars.MenuCount = i;
                    state.vars.MenuNext = true;
                    if (GetLang()){LocMenu = LocMenu+'N) Next';}
                    else {LocMenu= LocMenu+'n) Ukurasa Ufwatao';}
                    i = 9999;
                }
            }
            state.vars.LocMenu = LocMenu;
            FOLocatorSiteText(state.vars.LocMenu);
            promptDigits('FOLocSite', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
        else{
            FOLocatorWardText(state.vars.LocMenu);
            promptDigits('FOLocWard', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
    }
});
addInputHandler('FOLocSite', function(Site) {
    LogSessionID();
    InteractionCounter('FOLocSite');
    var LocValid = false;
    if(Site == 0 || Site == '#'){
        var reason = 'Site not known to non client on FO Locator';
        var sub = 'Call back requested for: ' + reason +' phone number: '+ contact.phone_number;
        var create_zd_ticket = require('ext/zd-tr/lib/create-ticket');
        var tags = ['site', 'field officer', 'site locator'];
        if(create_zd_ticket(contact.phone_number, sub, contact.phone_number, tags)){
            console.log('created_ticket!');
            CallMeBackFOLOcatorConfirmText();
            hangUp();
        }
        else{
            console.log('create_ticket failed on ' + contact.phone_number);
            FOLocatorSiteText(state.vars.LocMenu);
            promptDigits('FOLocSite', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }

        stopRules();
    }
    var SiteID = '';
    var NextSelected = FOLocatorNextSelect(Site);
    if (state.vars.MenuNext && NextSelected){
        var LocMenu = LocationNext();
        FOLocatorSiteText(LocMenu);
        promptDigits('FOLocSite', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else {
        var SiteArray = JSON.parse(state.vars.LocArray);
        for (var i = 0; i < SiteArray.length; i++) {
            if (SiteArray[i].Menu == Site) {
                SiteID = SiteArray[i].ID;
                LocValid = true;
                state.vars.SiteName = SiteArray[i].Name;
                state.vars.FOLocatorSiteName = SiteArray[i].Name;
            }
        }
        if (LocValid){
            console.log('Seaching site with ID '+SiteID);
            var table = project.getOrCreateDataTable('FO_Locator_Sites');
            var cursor = table.queryRows({vars: {'siteid': SiteID}});
            cursor.limit(1);
            console.log('Number of results: '+cursor.count());
            var row = cursor.next();
            state.vars.FOName = row.vars.foname;
            state.vars.FOPN = row.vars.fophonenumber;
            console.log('Results found and put in state:');
            console.log(state.vars.FOName);
            console.log(state.vars.FOPN);
            FOLocatorConfirmText();
            promptDigits('FOLocConfrim', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
        else {
            FOLocatorSiteText(state.vars.LocMenu);
            promptDigits('FOLocSite', {submitOnHash: true, maxDigits: 2, timeout: 5});
        }
    }
});
addInputHandler('FOLocConfrim', function(Confirm) {
    LogSessionID();
    InteractionCounter('FOLocConfrim');
    if (Confirm == '1'){
        // Please use scheduled message function for PUSH SMSes from the USSD service to make sure that the traffic pops up in the dashboard here: https://telerivet.com/p/0c6396c9/message_stats?cumulative=false&field=count&rollup=day&groups=main.series.service%2Cmain.series.type%2Cmain.series.direction&start_date=6.4.2020&end_date=6.5.2020 This is used for budgetting
        var FarmerSMSContent = FOLocatorFarmerSMS();
        project.scheduleMessage({
            message_type: 'service',
            to_number: contact.phone_number,
            start_time_offset: 0,
            service_id: 'SVc758c8b7ad90dd27',
            vars: {content: FarmerSMSContent}
        });

        var FOSMSContent = FOLocatorFOSMS();
        project.scheduleMessage({
            message_type: 'service',
            to_number: state.vars.FOPN,
            start_time_offset: 0,
            service_id: 'SVc758c8b7ad90dd27',
            vars: {content: FOSMSContent}
        });

        var ProspectTable = project.getOrCreateDataTable('FO_Locator_Prospects');
        var ProspectRow = ProspectTable.createRow({
            vars: {
                ProspectPN: contact.phone_number,
                SiteName: state.vars.FOLocatorSiteName,
                WardName: state.vars.FOLocatorWardName,
                FOName: state.vars.FOName,
                FOPhoneNumber: state.vars.FOPN
            }
        });
        ProspectRow.save();
        FOLocatorConfirmSuccessText();
        hangUp();
    }
    else{
        FOLocatorConfirmDeclineText();
        hangUp();
    }
});
addInputHandler('JITTUAccNum', function(JITTUAccNum) {
    LogSessionID();
    InteractionCounter('JITTUAccNum');
    var JITEOrder = JITECheckPreviousAccNum(JITTUAccNum);
    if (JITTUAccNum == '1'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if(JITEOrder){
        JITTU_JITEClientText();
        promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        if(RosterClientVal(JITTUAccNum)){
            var JIT_client = RosterClientGet(JITTUAccNum);
            state.vars.JIT_client = JSON.stringify(TrimClientJSON(JIT_client));
            client = JSON.parse(state.vars.client);
            if (client.GroupId == JIT_client.GroupId){
                var FarmerSeason = JIT_client.BalanceHistory[0].SeasonName;
                if (FarmerSeason == CurrentSeasonName){
                    var PrepaymentNeeded = GetPrepaymentAmount(JIT_client);
                    var Paid = JIT_client.BalanceHistory[0].TotalRepayment_IncludingOverpayments;
                    if (Paid  >= PrepaymentNeeded){
                        JITTUOrderOverview(JIT_client);
                    }
                    else{
                        JITTUPrepaymentNotValidText (Paid,PrepaymentNeeded);
                        hangUp();
                    }
                }
                else{
                    JITTUNotEnrolled();
                    promptDigits('JITTUAccNum', {submitOnHash: true, maxDigits: 1, timeout: 5});
                }
            }
            else {
                JITTUAccNumNotValidText();
                promptDigits('JITTUAccNum', {submitOnHash: true, maxDigits: 8, timeout: 5});
            }
        }
        else {
            JITTUAccNumNotValidText();
            promptDigits('JITTUAccNum', {submitOnHash: true, maxDigits: 8, timeout: 5});
        }
    }
});
addInputHandler('JITTUBundleSelect', function(BundleSelect){
    LogSessionID();
    InteractionCounter('JITTUBundleSelect');
    if (BundleSelect =='9'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        var bundleoptions = JSON.parse(state.vars.JITTUOrdersAvailable);
        var ValidOption = false;
        for (var i = 0; i < bundleoptions.length; i++) {
            var MenuNumber = i+1;
            if(BundleSelect == MenuNumber){
                var  JIT_client = JSON.parse(state.vars.JIT_client);
                ValidOption = true;
                state.vars.bundleselect = JSON.stringify(bundleoptions[i]);
                if (bundleoptions[i].variety== true){
                    var warehousename = JITgetWarehouse(JIT_client.DistrictName);
                    var varieties = JITGetVarieties(warehousename);
                    JITTUVarietySelectText(varieties);
                    promptDigits('JITTUVarietySelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
                }
                else{
                    JITTUOrderNoVarConfrimText(bundleoptions[i].bundlename);
                    promptDigits('JITTUConfirm', {submitOnHash: true, maxDigits: 1, timeout: 5});
                }
            }
        }
        if(ValidOption === false){
            JITBundleSelectText(bundleoptions);
            promptDigits('JITTUBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
});
addInputHandler('JITTUVarietySelect', function(VarietySelected) {
    LogSessionID();
    InteractionCounter('JITTUVarietySelect');
    if (VarietySelected == '9'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        var valid = false;
        var variety = '';
        var varieties = JSON.parse(state.vars.varieties);
        for (var i = 0; i < varieties.length; i++) {
            var menu = i+1;
            if (VarietySelected == menu){
                valid = true;
                variety = varieties[i];
                state.vars.variety = varieties[i];
            }
        }
        if (valid){
            var bundleselected = JSON.parse(state.vars.bundleselect);
            JITTUOrderConfrimText(bundleselected.bundlename,variety);
            promptDigits('JITTUConfirm', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else {
            var JIT_client = JSON.parse(state.vars.JIT_client);
            var warehousename = JITgetWarehouse(JIT_client.DistrictName);
            varieties = JITGetVarieties(warehousename);
            JITTUVarietySelectText(varieties);
            promptDigits('JITTUVarietySelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
});
addInputHandler('JITTUConfirm', function(Confirm){
    LogSessionID();
    InteractionCounter('JITTUConfirm');
    var bundleSelected = JSON.parse(state.vars.bundleselect);
    if (Confirm == '9'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if(Confirm == '1'){
        var JIT_client = JSON.parse(state.vars.JIT_client);
        var warehousename = JITgetWarehouse(JIT_client.DistrictName);
        JITTUCreateOrder(JIT_client,bundleSelected, state.vars.variety);
        JITUpdateWarehouse(warehousename,bundleSelected.bundlename, state.vars.variety);
        JITTUOrderOverview (JIT_client);
    }
    else {
        JITTUOrderNoVarConfrimText(bundleSelected.bundlename);
        promptDigits('JITTUConfirm', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('ContinueToJITTUBundleSelect', function(Continue) {
    LogSessionID();
    InteractionCounter('ContJITTUBundle');
    if(Continue =='2') {
        JIT_client = JSON.parse(state.vars.JIT_client);
        var orderoverview = JITTURetrieveOrders(JIT_client.AccountNumber);
        JITTUOrderOverviewSMS(orderoverview, JIT_client.AccountNumber, contact.phone_number);
        JITTUOrderedText();
        hangUp();
    }
    else{
        console.log(state.vars.JIT_client);
        var JIT_client = JSON.parse(state.vars.JIT_client);
        var BundleOptions = JITTUGetOrderOptions(JIT_client);
        JITBundleSelectText(BundleOptions);
        promptDigits('JITTUBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('ViewJITOrder', function(JITTU_accNum) {
    LogSessionID();
    InteractionCounter('ViewJITOrder');
    if (JITTU_accNum == '1'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 8, timeout: 5});
    }
    else{
        var JITTUOrders = JITTURetrieveOrders(JITTU_accNum);
        console.log('Order overview: '+JSON.stringify(JITTUOrders));
        JITTUShowOrdersText(JITTUOrders);
        promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('JITEAccNum', function(JITE_AccNum){
    LogSessionID();
    InteractionCounter('JITEAccNum');
    if (JITE_AccNum == '0'){
        JITEFirstNameText();
        promptDigits('JITEFirstName', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
    else{
        var alreadyOrdered = JITECheckPreviousAccNum(JITE_AccNum);
        if (alreadyOrdered) {
            JITEAlreadyOrderedText();
            promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else {
            if (RosterClientVal(JITE_AccNum)){
                console.log('SuccessFully Validated against Roster');
                var JITE_client = RosterClientGet(JITE_AccNum);
                client = JSON.parse(state.vars.client);
                var NotBanned = true;
                if (GetBalance(JITE_client, LastSeason)>0){NotBanned = false;}
                if (client.DistrictId == JITE_client.DistrictId && NotBanned){
                    if (JITE_client.BalanceHistory[0].SeasonName == CurrentSeasonName){
                        if (JITE_client.BalanceHistory[0].TotalCredit== 0){
                            state.vars.JITE_client = JSON.stringify(TrimClientJSON(JITE_client));
                            var JITEOrderOptions = JITEGetOrderOptions();
                            JITEBundleSelectText(JITEOrderOptions);
                            promptDigits('JITEBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
                        }
                        else{
                            JITEAccNumAlreadyEnrolledText();
                            promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
                        }
                    }
                    else {
                        state.vars.JITE_client = JSON.stringify(TrimClientJSON(JITE_client));
                        JITEOrderOptions = JITEGetOrderOptions();
                        JITEBundleSelectText(JITEOrderOptions);
                        promptDigits('JITEBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
                    }
                }
                else {
                    JITEAccNumNotValidText();
                    promptDigits('JITEAccNum', {submitOnHash: true, maxDigits: 8, timeout: 5});
                }
            }
            else {
                JITEAccNumNotValidText();
                promptDigits('JITEAccNum', {submitOnHash: true, maxDigits: 8, timeout: 5});
            }
        }
    }
});
addInputHandler('JITEFirstName', function(){
    LogSessionID();
    InteractionCounter('JITEFirstName');
    JITELastNameText();
    promptDigits('JITESecondName', {submitOnHash: true, maxDigits: 10, timeout: 5});
});
addInputHandler('JITESecondName', function(){
    LogSessionID();
    InteractionCounter('JITESecondName');
    JITENationalIDText();
    promptDigits('JITENationalID', {submitOnHash: true, maxDigits: 10, timeout: 5});
});
addInputHandler('JITENationalID', function(JITE_NationalID){
    LogSessionID();
    InteractionCounter('JITENationalID');
    if (ValNationalID(JITE_NationalID)){
        var alreadyOrdered = JITECheckPreviousNationalID(JITE_NationalID);
        if (alreadyOrdered) {
            JITEAlreadyOrderedText();
            promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else {
            var JITEOrderOptions = JITEGetOrderOptions();
            JITEBundleSelectText(JITEOrderOptions);
            promptDigits('JITEBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
    else {
        JITENationalInvalidText();
        promptDigits('JITENationalID', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
});
addInputHandler('JITEBundleSelect', function(JITE_BundleSelect){
    LogSessionID();
    InteractionCounter('JITEBundleSelect');
    if (JITE_BundleSelect =='9'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        client = JSON.parse(state.vars.client);
        var bundleoptions = JSON.parse(state.vars.JITEOrdersAvailable);
        var ValidOption = false;
        for (var i = 0; i < bundleoptions.length; i++) {
            var MenuNumber = i+1;
            if(JITE_BundleSelect == MenuNumber){
                ValidOption = true;
                if (bundleoptions[i].variety== true){
                    var warehousename = JITgetWarehouse(client.DistrictName);
                    var varieties = JITGetVarieties(warehousename);
                    JITTUVarietySelectText(varieties);
                    state.vars.JITEbundleselect = JSON.stringify(bundleoptions[i]);
                    promptDigits('JITEVarietySelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
                }
                else{console.log('no varieties back up');}
            }
        }
        if(ValidOption === false){
            JITEBundleSelectText(bundleoptions);
            promptDigits('JITEBundleSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
});
addInputHandler('JITEVarietySelect', function(JITE_VarSelect){
    LogSessionID();
    InteractionCounter('JITEVarietySelect');
    if (JITE_VarSelect == '9'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        var valid = false;
        var variety = '';
        var varieties = JSON.parse(state.vars.varieties);
        for (var i = 0; i < varieties.length; i++) {
            var menu = i+1;
            if (JITE_VarSelect == menu){
                valid = true;
                variety = varieties[i];
            }
        }
        if (valid){
            state.vars.variety = variety;
            var bundleselected = JSON.parse(state.vars.JITEbundleselect);
            JITEOrderConfrimText(bundleselected.bundlename,variety);
            promptDigits('JITEConfirm', {submitOnHash: true, maxDigits: 10, timeout: 5});
        }
        else {
            varieties = JSON.parse(state.vars.varieties);
            JITTUVarietySelectText(varieties);
            promptDigits('JITEVarietySelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
});
addInputHandler('JITEConfirm', function(Confirm){
    LogSessionID();
    InteractionCounter('JITEConfirm');
    if (Confirm == '9'){
        var client = JSON.parse(state.vars.client);
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        var Phonenumber = Confirm;
        var ValidPhone =  ValidPN(Phonenumber);
        if (ValidPhone){
            var variety = state.vars.variety;
            var bundleselected = JSON.parse(state.vars.JITEbundleselect);
            var GLclient = JSON.parse(state.vars.client);
            var warehousename = JITgetWarehouse(GLclient.DistrictName);
            JITECreateOrder(call.vars.JITEAccNum,call.vars.JITEFirstName, call.vars.JITESecondName, call.vars.JITENationalID, GLclient,bundleselected,variety,  warehousename,Phonenumber);
            JITEOrdeCloseText();
            JITEOrderConfrimSMS(Phonenumber, bundleselected.bundlename,variety);
            JITEOrderConfrimSMS(contact.phone_number, bundleselected.bundlename,variety);
            hangUp();
        }
        else {
            variety = state.vars.variety;
            bundleselected = JSON.parse(state.vars.JITEbundleselect);
            JITEOrderConfrimText(bundleselected.bundlename,variety);
            promptDigits('JITEConfirm', {submitOnHash: true, maxDigits: 10, timeout: 5});
        }
    }
});
addInputHandler('FAWOrder', function(Order){
    LogSessionID();
    InteractionCounter('FAWOrder');
    var client = JSON.parse(state.vars.client);
    if (Order =='9'){

        if (state.vars.FAWAllowcancel){
            FAWCancelOrderText();
            promptDigits('FAWCancelAmount', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else{
            MainMenuText (client);
            promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
    else{
        if (isNaN(Order)){
            FAWOrderText(state.vars.FAWRemaining);
            promptDigits('FAWOrder', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else if (parseInt(Order)<=  parseInt(state.vars.FAWRemaining)&&parseInt(Order)>0){
            state.vars.FAWOrder = Order;
            client = JSON.parse(state.vars.client);
            FAWConfirmText(Order);
            promptDigits('FAWConfirm', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else {
            FAWOrderText(state.vars.FAWRemaining);
            promptDigits('FAWOrder', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
});

addInputHandler('FAWCancel', function(){
    LogSessionID();
    InteractionCounter('FAWCancel');
    FAWCancelOrderText();
    promptDigits('FAWCancelAmount', {submitOnHash: true, maxDigits: 1, timeout: 5});
});

addInputHandler('FAWCancelAmount', function(input){
    LogSessionID();
    InteractionCounter('FAWCanAm');
    var client = JSON.parse(state.vars.client);
    var CancelAmount = input;
    if (input =='9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        if (input > 0 && input <= state.vars.FAWCancelAmount){
            FAWProcessCancel(client.AccountNumber, CancelAmount);
            FAWCancelConfirmText(CancelAmount);
            promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else{
            FAWCancelOrderText();
            promptDigits('FAWCancelAmount', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
});

addInputHandler('FAWConfirm', function(confirm){
    LogSessionID();
    InteractionCounter('FAWConfirm');
    var client = JSON.parse(state.vars.client);
    if (confirm == '1'){
        FAWCreateOrder (client, state.vars.FAWOrder);
        FAWSuccessText(state.vars.FAWOrder);
        FAWSuccessSMS(state.vars.FAWOrder);
        promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (confirm == '9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('SolarMenu', function(Menu){
    LogSessionID();
    InteractionCounter('SolarMenu');
    var client = JSON.parse(state.vars.client);
    if (Menu =='9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (Menu =='1'){
        if (EnrolledAndQualified(client)){
            if (SHSValidateReg(client, CurrentSeasonName)){
                SHSSerialText();
                promptDigits('SerialRegister', {submitOnHash: true, maxDigits: 20, timeout: 5});
            }
            else {
                SHSRegNoOrderText();
                promptDigits('ReportIssueOrBackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
            }
        }
        else{
            SHSNotQualifiedText();
            promptDigits('ReportIssueOrBackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
    else if (Menu =='2'){
        var SerialList = GetSerialForClient(client.AccountNumber);
        if (SerialList.length == 1){
            var SHSDetail = GetSHSDetails(client.AccountNumber, SerialList[0].SerialNumber);
            var arrayLength = client.BalanceHistory.length;
            for (var i = 0; i < arrayLength; i++) {
                if (client.BalanceHistory[i].SeasonName == SHSDetail.season){
                    if (client.BalanceHistory[i].Balance>0 && client.DistrictName != StaffDistrict){
                        LoanNotRepaidText(client.BalanceHistory[i].SeasonName);
                        promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
                    }
                    else {
                        state.vars.SHSCode = SHSDetail.UnlockCode;
                        SHSUnlockText(SHSDetail.UnlockCode, SHSDetail.season);
                        promptDigits('SHSCodeContinue', {submitOnHash: true, maxDigits: 1, timeout: 5});
                    }
                }
            }
        }
        else{
            SHSSerialText();
            promptDigits('SerialCode', {submitOnHash: true, maxDigits: 10, timeout: 5});
        }
    }
    else if(Menu =='99'){
        CallMeBackText();
        state.vars.issuetype = 'SHS';
        promptDigits('CallBackPN', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
});
addInputHandler('SerialRegister', function(Serial){
    console.log(Serial);
    LogSessionID();
    InteractionCounter('SerialRegister');
    var client = JSON.parse(state.vars.client);
    if (Serial =='9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (Serial =='99'){
        CallMeBackText();
        state.vars.issuetype = 'SHS';
        promptDigits('CallBackPN', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
    else {
        state.vars.Serial = Serial;
        var SHSTypeArray = JSON.parse(state.vars.SHS_Type);
        var CountSHSType = SHSTypeArray.length;
        console.log('Number of SHS type options: '+CountSHSType);
        if (CountSHSType == 1 ){
            console.log('Checking Serial number including SHS type');
            var Status = SHSValidateSerial (client.AccountNumber,Serial, SHSTypeArray[0]);
        }
        else{
            console.log('Checking Serial number disregarding SHS type');
            Status = SHSValidateSerial (client.AccountNumber,Serial);
        }

        if(Status == 'RegAccNum'){
            SHSShowCode(client,Serial,state.vars.SHS_Type);
        }
        else if (Status == 'MultipleFound'){
            SHSTypeText();
            promptDigits('SerialType', {submitOnHash: true, maxDigits: 10, timeout: 5});
        }
        else if (SHSRegThisSeason(client.AccountNumber)){
            console.log('Not allowed to register more this season');
            SHSSerialNotValidText();
            promptDigits('SerialRegister', {submitOnHash: true, maxDigits: 10, timeout: 5});
        }
        else {
            if(Status == 'NotReg'){
                SHSRegSerial(client,Serial,state.vars.SHS_Type);
                SHSShowCode(client,Serial,state.vars.SHS_Type);
            }
            else if(Status == 'RegOther'){
                SHSRegOtherText();
                promptDigits('SerialRegister', {submitOnHash: true, maxDigits: 10, timeout: 5});
            }

            else {
                SHSSerialNotValidText();
                promptDigits('SerialRegister', {submitOnHash: true, maxDigits: 10, timeout: 5});
            }
        }
    }
});

addInputHandler('SerialType', function(Type){
    LogSessionID();
    InteractionCounter('SerialRegister');
    var client = JSON.parse(state.vars.client);
    if (Type =='9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        var Serial = state.vars.Serial;

        //1) Test if Provided input is valid
        var SHSTypeArray = JSON.parse(state.vars.SHS_Type);
        var i = Type - 1;
        var Valid = false;
        console.log('Array length: '+ SHSTypeArray.length);
        console.log('Menu selected: '+Type);
        console.log('i: '+i);

        if (i<= SHSTypeArray.length-1){
            state.vars.SHS_Type = SHSTypeArray[i];
            console.log('Selection valid, SHS type: '+ state.vars.SHS_Type);
            Valid = true;
        }

        if (Valid){
            //2) Run Validate and register code
            var Status = SHSValidateSerial (client.AccountNumber,Serial, state.vars.SHS_Type);
            if(Status == 'RegAccNum'){
                SHSShowCode(client,Serial,state.vars.SHS_Type);
            }
            else if (SHSRegThisSeason(client.AccountNumber)){
                SHSSerialNotValidText();
                promptDigits('SerialRegister', {submitOnHash: true, maxDigits: 10, timeout: 5});
            }
            else {
                if(Status == 'NotReg'){
                    SHSRegSerial(client,Serial,state.vars.SHS_Type);
                    SHSShowCode(client,Serial,state.vars.SHS_Type);
                }
                else if(Status == 'RegOther'){
                    SHSRegOtherText();
                    promptDigits('SerialRegister', {submitOnHash: true, maxDigits: 10, timeout: 5});
                }
                else if (Status == 'MultipleFound'){
                    SHSTypeText();
                    promptDigits('SerialType', {submitOnHash: true, maxDigits: 10, timeout: 5});
                }
                else {
                    SHSSerialNotValidText();
                    promptDigits('SerialRegister', {submitOnHash: true, maxDigits: 10, timeout: 5});
                }
            }
        }
        else {
            SHSTypeText();
            promptDigits('SerialType', {submitOnHash: true, maxDigits: 10, timeout: 5});
        }
    }
});

addInputHandler('SerialCode', function(Serial){
    LogSessionID();
    InteractionCounter('SerialCode');
    var client = JSON.parse(state.vars.client);
    if (Serial =='9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (Serial =='99'){
        CallMeBackText();
        state.vars.issuetype = 'SHS';
        promptDigits('CallBackPN', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
    if (SHSShowCode(client,Serial) === false){
        SHSSerialNotValidText();
        promptDigits('SerialCode', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
});
addInputHandler('SHSCodeContinue', function(){
    LogSessionID();
    InteractionCounter('SHSCodeContinue');
    var client = JSON.parse(state.vars.client);
    MainMenuText (client);
    promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
});
addInputHandler('ReportIssueOrBackToMain', function(Input){
    LogSessionID();
    InteractionCounter('ReportIssue');
    state.vars.issuetype = 'SHS';
    var client = JSON.parse(state.vars.client);
    if (Input =='99'){
        CallMeBackText();
        promptDigits('CallBackPN', {submitOnHash: true, maxDigits: 10, timeout: 5});
    }
    else{
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('CallBackPN', function(Input){
    LogSessionID();
    InteractionCounter('CallBackPN');
    var create_zd_ticket = require('ext/zd-tr/lib/create-ticket');
    var client = JSON.parse(state.vars.client);
    if (Input =='9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (Input =='1'){
        var sub = 'Call back requested for: ' + state.vars.issuetype +' account number : '+ client.AccountNumber+ 'With phonenumber: '+ contact.phone_number;
        var tags = ['kenya', state.vars.issuetype, 'SerialCode'];
        if(create_zd_ticket(client.AccountNumber, sub, contact.phone_number, tags)){
            console.log('created_ticket!');
            CallMeBackConfirmText();
            promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else{
            console.log('create_ticket failed on ' + client.AccountNumber);
            CallMeBackText();
            promptDigits('CallBackPN', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
    else {

        sub = 'Call back requested for: ' + state.vars.issuetype +' account number : '+ client.AccountNumber+ 'With phonenumber: '+  Input;
        if(create_zd_ticket(client.AccountNumber, sub, Input)){
            console.log('created_ticket!');
            CallMeBackConfirmText();
            promptDigits('BackToMain', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
        else{
            console.log('create_ticket failed on ' + client.AccountNumber);
            CallMeBackText();
            promptDigits('CallBackPN', {submitOnHash: true, maxDigits: 1, timeout: 5});
        }
    }
});
addInputHandler('InsuranceMenu', function(input) {
    LogSessionID();
    InteractionCounter('InsuranceMenu');
    var client = JSON.parse(state.vars.client);
    if (input =='9'){
        MainMenuText (client);
        promptDigits('MainMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (input == '1') {
        HospitalRegionText();
        promptDigits('HospitalRegion', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }

    else{
        InsuranceMenuText();
        promptDigits('InsuranceMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }

});
addInputHandler('HospitalRegion', function(input) {
    LogSessionID();
    InteractionCounter('HospitalRegion');
    if(input == 1 ||input == 2 || input == 3 || input == 4 ||input == 5 || input == 6 || input == 7 || input == 8){
        state.vars.LocMenuText = HospitalTownsRetrieve(input);
        sayText(state.vars.LocMenuText);
        promptDigits('HospitalTown', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else {
        HospitalRegionText();
        promptDigits('HospitalRegion', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('HospitalTown', function(input) {
    LogSessionID();
    InteractionCounter('HospitalTown');
    if (state.vars.MenuNext && input == '0'){
        state.vars.LocMenuText = LocationNext();
        sayText(state.vars.LocMenuText);
        promptDigits('HospitalTown', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else if (ValidateHostitalInput(input)){
        state.vars.LocMenuText = HospitalsRetrieve(state.vars.locID);
        sayText(state.vars.LocMenuText);
        promptDigits('Hospital', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else{
        sayText(state.vars.LocMenuText);
        promptDigits('HospitalTown', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
});
addInputHandler('Hospital', function(input) {
    LogSessionID();
    InteractionCounter('Hospital');
    console.log(state.vars.LocMenuText);
    if (state.vars.MenuNext && input == 0){
        state.vars.LocMenuText = LocationNext();
        sayText(state.vars.LocMenuText);
        promptDigits('Hospital', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else{
        sayText(state.vars.LocMenuText);
        promptDigits('Hospital', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
});
addInputHandler('StaffPayRoll', function(input) {
    LogSessionID();
    InteractionCounter('StaffPayRoll');
    if (ValidPayRollID(input)){
        state.vars.payrollid = input;
        StaffMenuText();
        promptDigits('StaffMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        StaffPayrollText();
        promptDigits('StaffPayRoll', {submitOnHash: true, maxDigits: 5, timeout: 5});
    }
});

addInputHandler('StaffMenu', function(input) {
    LogSessionID();
    InteractionCounter('StaffMenu');
    if (input == 1){
        StaffDaySelectText();
        promptDigits('DaySelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (input == 2){
        state.vars.MaxAnswer = 5;
        StaffTabletIssueText();
        promptDigits('StaffTabletIssue', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    //else if (input == 3){
    //  state.vars.MaxAnswer = 3;
    //StaffRosterIssueText();
    //promptDigits("StaffRosterIssue", {submitOnHash: true, maxDigits: 1, timeout: 5});
    //}
    else{
        StaffMenuText();
        promptDigits('StaffMenu', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }

});

addInputHandler('DaySelect', function(input) {
    LogSessionID();
    InteractionCounter('DaySelect');
    if (input == 1 || input == 2 || input ==3){
        StaffDayAmountText();
        promptDigits('DayAmount', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else if (input == 0 ){
        sayText('Thank you');
        hangUp();
    }
    else{
        StaffDaySelectText();
        promptDigits('DaySelect', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
});

addInputHandler('DayAmount', function(input) {
    LogSessionID();
    InteractionCounter('DayAmount');
    if (input == 1 || input == 2 || input ==3){
        var amount = input;
        var StaffDetail = GetStaffDetails(state.vars.payrollid);
        StaffCreateRequest (StaffDetail.payrollid, call.vars.DaySelect,amount);
        StaffConfrimAbsenceText(StaffDetail.name);
        StaffConfrimAbsenceEmail(StaffDetail.email, StaffDetail.name, call.vars.DaySelect, amount);
        // place holder for email to HR
    }
    else if (input == 4){
        StaffCallForAbsenceText();
        hangUp();
    }
    else if (input == 0 ){
        sayText('Thank you');
        hangUp();
    }
    else {
        StaffDayAmountText();
        promptDigits('DayAmount', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
});

addInputHandler('StaffTabletIssue', function(input) {
    LogSessionID();
    InteractionCounter('StaffTabIssue');
    if (input>0 && input<= state.vars.MaxAnswer){
        state.vars.IssueLevel1 = 'Tablet Issue';
        state.vars.IssueLevel2Ans = input;
        if (input == 1){
            state.vars.MaxAnswer = 5;
            StaffFSAppIssueText();
        }
        else if (input == 2){
            state.vars.MaxAnswer = 5;
            StaffMEAppIssueText();
        }
        else if (input == 3){
            state.vars.MaxAnswer = 4;
            StaffGSuiteIssueText();
        }
        else if (input == 4){
            state.vars.MaxAnswer = 3;
            StaffTabletHardwareIssueText();
        }
        else if (input == 5){
            state.vars.MaxAnswer = 6;
            StaffTabletDownIssueText();
        }
        promptDigits('StaffIssueLowlevel', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        StaffTabletIssueText();
        promptDigits('StaffTabletIssue', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});

addInputHandler('StaffRosterIssue', function(input) {
    LogSessionID();
    InteractionCounter('StaffRosIssue');
    if (input>0 && input<= state.vars.MaxAnswer){
        state.vars.IssueLevel1 = 'Roster Issue';
        state.vars.IssueLevel2Ans = input;
        if (input == 1){
            state.vars.MaxAnswer = 2;
            StaffSiteRepayIssueText();
        }
        else if (input == 2){
            state.vars.MaxAnswer = 3;
            StaffSiteDeliveryIssueText();
        }
        else if (input == 3){
            state.vars.MaxAnswer = 4;
            StaffTabletRosterText();
        }
        promptDigits('StaffIssueLowlevel', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else{
        StaffRosterIssueText();
        promptDigits('StaffRosterIssue', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
});
addInputHandler('StaffIssueLowlevel', function(input) {
    LogSessionID();
    InteractionCounter('StaffTabLowIssue');
    if (input>0 && input<= state.vars.MaxAnswer){
        state.vars.IssueLevel3Ans = input;
        StaffIssueSuccessText();
        var Body = 'Staff call back request on phonenumber: '+contact.phone_number+': \nIssue type: '+state.vars.IssueLevel1+'\n\n'+state.vars.IssueLevel2Ques+ '\n Answer: '+state.vars.IssueLevel2Ans+'\n\n'+state.vars.IssueLevel3Ques+ '\n Answer: '+state.vars.IssueLevel3Ans;
        console.log(contact.phone_number);
        console.log(state.vars.IssueLevel1);
        console.log(Body);
        StaffCallBackCreate(contact.phone_number,state.vars.IssueLevel1,Body);
        hangUp();
    }
    else{
        sayText(state.vars.IssueLevel3Ques);
        promptDigits('StaffIssueLowlevel', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }

});

addInputHandler('TrainingSelect', function(input) {
    LogSessionID();
    try{
        var client = JSON.parse(state.vars.client);
        contact.vars.accountnumber = client.AccountNumber;
        contact.vars.client = state.vars.client;
        contact.save();

    }
    catch(err){
        console.log('non client trigger');
        client = 'Non Client';
        contact.vars.accountnumber = 'Non Client';
        contact.save();
    }
    InteractionCounter('TrainingSelect');
    var trainingsOptions = JSON.parse(state.vars.trainings_options);
    if (input == 0 ){
        TrainingMenuNextText();
        promptDigits('TrainingSelect', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
    else if (trainingsOptions[input] == 'maize_intercorp'){

        var Random = Math.random();
        console.log(Random);

        // if (Random > 0.25){
        //     console.log('triggered default');
        //     TriggerTraining('SVc03fa156b80cc6a4');
        // }
        // else {TriggerTraining('SV672cd762c6389124');}
        TriggerTraining('SVc03fa156b80cc6a4');

        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'tree_transplanting'){
        TriggerTraining('SV87c0c32ff5e3ebaa');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'tree_bag_planting'){
        TriggerTraining('SV647a6f30fad7625d');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'tree_socketing'){
        TriggerTraining('SV8419e6228a23cec2');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'sorghum_weeding'){
        TriggerTraining('SV7aa1486d6be8ae59');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'maize_topdress'){
        TriggerTraining('SVffc2c4aa2be69ab5');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'maize_harvest'){
        TriggerTraining('SV72a3bbd1d14b037b');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'pest_mitigation'){
        TriggerTraining('SV6d234d3094715099');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else if (trainingsOptions[input] == 'vegetables'){
        TrainingPlatSelectText();
        promptDigits('TrainingPlatformSelect', {submitOnHash: true, maxDigits: 1, timeout: 5});
    }
    else if (trainingsOptions[input] == 'tatu_hadi_tatu'){
        TriggerTraining('SV1a959518b783e17f');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    } else if(trainingsOptions[input] == 'nutrition_training') {
        var nutritionTraining = require('../nutrition-training/triggerService');
        nutritionTraining(GetLang()? 'en-ke' : 'sw', project.vars.nutrition_training_service);
    }
    else if (trainingsOptions[input] == 'soil_training') {
        // trigger the nutrition training
        var lang;
        if(GetLang()) {
            lang = 'en-ke';
        } else {
            lang = 'sw';
        }
        var TriggersoilTraining = require('../soil-fertility-trainings/triggerService');
        TriggersoilTraining(lang, project.vars.soil_training_service_id);
    } else{
        TrainingMenuText();
        promptDigits('TrainingSelect', {submitOnHash: true, maxDigits: 2, timeout: 5});
    }
});

addInputHandler('TrainingPlatformSelect', function(input) {
    LogSessionID();
    InteractionCounter('TrainingPlatSelect');

    if (input == 1 ){
        TriggerTraining('SVeafd5eeb2dadc2d2');
        TrainingTriggeredText(contact.name, GetLang()? 'en-ke' : 'sw' );
    }
    else {
        TrainingTriggeredIVRText();
        hangUp();
        if (GetLang()){

            project.scheduleMessage({
                message_type: 'call',
                to_number: contact.phone_number,
                start_time_offset: 0,
                service_id: 'SV40cc89e83d0e5810',
                route_id: 'PN54d237477649c512'
            });
        }
        else {
            project.scheduleMessage({
                message_type: 'call',
                to_number: contact.phone_number,
                start_time_offset: 0,
                service_id: 'SV6b002eba0603b476',
                route_id: 'PN54d237477649c512'
            });
        }
    }
});

addInputHandler('registrationHandler', function(input){
    LogSessionID();
    InteractionCounter('registrationHandler');
    if(input == 0){
        clientRegistration.start(client.AccountNumber,'ke',state.vars.lang);
    }
    else{
        clientEnrollment.start(input,'ke', state.vars.lang);
    }
});
