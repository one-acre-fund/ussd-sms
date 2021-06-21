/*
main get-balance function for core USSD
*/
var healthyPath = require('../../healthy-path/balance/healthyPathOnBalance');
module.exports = function(client, lang){
    lang = lang || 'ki';
    var districts = project.getOrCreateDataTable('districts');
    var mm_client = 0; //check MM
    var d_cur = districts.queryRows({vars: {'district': state.vars.client_district}});
    if(d_cur.hasNext()){
        mm_client = d_cur.next().mm;
    }
    var balance = '';
    var paid = 0;
    var credit = 0;
    var overpayment = 0;
    var currentRepaymentSeasonDetails = client.BalanceHistory.filter(function(seasonDetails) {
        return seasonDetails.SeasonName == project.vars.current_repayment_season_name;
    });
    currentRepaymentSeasonDetails = currentRepaymentSeasonDetails.length > 0 ? currentRepaymentSeasonDetails : client.BalanceHistory[0];
    for (var i = 0; i < currentRepaymentSeasonDetails.length; i++) {
        if (currentRepaymentSeasonDetails[i].Balance >= 0){    
            paid = currentRepaymentSeasonDetails[i].TotalCredit-currentRepaymentSeasonDetails[i].Balance;
            balance = currentRepaymentSeasonDetails[i].Balance;
            credit = currentRepaymentSeasonDetails[i].TotalCredit;
        }
        if(currentRepaymentSeasonDetails[i].Balance < 0){
            credit = currentRepaymentSeasonDetails[i].TotalCredit;
            if(credit !== 0){ //added this clause
                console.log('overpayment!');
                paid = currentRepaymentSeasonDetails[i].TotalRepayment_IncludingOverpayments;
            }
            overpayment += currentRepaymentSeasonDetails[i].Balance;
        }
    }
    if(!paid){
        paid = (-1) * overpayment;
    }
    if(!credit){
        credit = 0;
    }
    if (balance === ''){
        balance = 0;
    }
    if(credit === 0 && overpayment < 0){
        var overpay_str = 'Overpayment from previous season:' + -1*overpayment + '\n';
        console.log(overpay_str);
    }
    var SubtractDays = 1;
    if(mm_client){
        if (moment().format('dddd') === 'Monday'){
            SubtractDays = 3;
        }
        else if (moment().format('dddd') === 'Sunday'){
            SubtractDays = 2;
        }
    }
    else{
        switch(moment().format('dddd')){
        case 'Tuesday'   : 
            SubtractDays = 0;
            break;
        case 'Wednesday' : 
            SubtractDays = 1;
            break;
        case 'Thursday'  : 
            SubtractDays = 2;
            break;
        case 'Friday'    : 
            SubtractDays = 3;
            break;
        case 'Saturday'  : 
            SubtractDays = 4;
            break;
        case 'Sunday'    : 
            SubtractDays = 5;
            break;
        case 'Monday'    : 
            SubtractDays = 6;
            break;
        default          :
            SubtractDays = 7;
            break;
        }
    }
    var day_name = moment().subtract(SubtractDays, 'days').format('dddd');
    var day_num = moment().subtract(SubtractDays, 'days').format('DD');
    var month = moment().subtract(SubtractDays, 'days').format('MMMM');
    if(lang === 'ki'){
        var ki_month_lookup = {'January': 'Ukwambere',
            'February': 'Ukwakabiri',
            'March': 'Ukwagatatu',
            'April': 'Ukwakane',
            'May': 'Ukwagatanu',
            'June': 'Ukwagatandatu',
            'July': 'Ukwakarindwi',
            'August': 'Ukwamunani',
            'September': 'Ukwacyenda',
            'October': 'Ukwacumi',
            'November': 'Ukwacuminakumwe',
            'December': 'Ukwacuminabiri',
        }; // this should be in a table somewhere
        var ki_day_lookup   = {'Monday': 'Kuwambere',
            'Tuesday': 'Kuwakabiri',
            'Wednesday': 'Kuwagatatu',
            'Thursday': 'Kuwakane',
            'Friday': 'Kuwagatanu',
            'Saturday': 'Kuwagatandatu',
            'Sunday': 'Kucyumweru'
        }; //this should also be in a table
        month = ki_month_lookup[month];
        day_name = ki_day_lookup[day_name];
    }
    /* deprecated this
    var pbi = require('./cor-pbi-integration-getbalance');
    try{ // not sure if this works, don't want to fix it
        pbi(client);
    }
    catch (error){
        console.log(error);
    }
    */
    // SeasonId: number, CountryId: number, DistrictId: number,
    var mostRecentSeason = client.BalanceHistory[0];
    var hpd = {
        countryId: client.CountryId,
        districtId: client.DistrictId
    };
    if (mostRecentSeason) {
        hpd.seasonId = mostRecentSeason.SeasonId;
    }

    var healthyPathMessage = healthyPath(hpd.seasonId, hpd.countryId, hpd.districtId, credit, paid, lang);

    return {'$CLIENT_NAME': client.ClientName,
        '$PAID': paid,
        '$BALANCE': balance,
        '$CREDIT': credit,
        '$DAY_NAME': day_name,
        '$MONTH': month,
        '$DAYNR': day_num,
        '$HEALTHY_PATH': healthyPathMessage};
};
