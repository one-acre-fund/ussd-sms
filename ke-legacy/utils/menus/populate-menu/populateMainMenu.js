const mainMenu = require('./mainMenu');
var createTranslator = require('../utils/translator/translator');
var translations = require('./translations');

var IsPrePayTrialDistrict= function(districtName){
    return false;
    //districtname = districtname.toLowerCase();
    //if (districtname == "nyando" || districtname == "kipkelion" || districtname == "chwele"){return true}
    //else {return false}

}
var SHSActive = function (districtname){
    var Table = project.getOrCreateDataTable("SHS Districts");
    Cursor = Table.queryRows({vars: {'districtname': districtname, 'active': "1"}});
    if (Cursor.count()>0){return true}
    else {return false}
};
var EnrolledAndQualified = function (client){
    var arrayLength = client.BalanceHistory.length;
    var Valid = false;
    for (var i = 0; i < arrayLength; i++) {
        if (client.BalanceHistory[i].SeasonName == CurrentSeasonName){    
            if(client.BalanceHistory[i].TotalCredit> 0){Valid = true}
        }
    }
    return Valid;
};
var skipMenuOption = function(optionName){
    var optionMenu = mainMenu.find(element => element.option_name = optionName);
    if((Date.parse(new Date()) > Date.parse(new Date(optionMenu.end_date))) || (Date.parse(new Date()) < Date.parse(new Date(optionMenu.start_date)))){
        return true;
    }
    else if(optionName == 'prepayment_amount'){
        if(!(IsPrePayTrialDistrict(JSON.parse(state.vars.client).DistrictName))){
            return true;
        }
    }
    else if(optionName == 'presticide_order'){
        if(!(EnrolledAndQualified(JSON.parse(state.vars.client)))){
            return true;
        }
    }
    else if(optionName == 'solar'){
        if(!(SHSActive(JSON.parse(state.vars.client).DistrictName))){
            return true;
        }
    }
    return false;
}

module.exports = function(lang, max_chars){
    var translate =  createTranslator(translations, lang);
    var prev_page = translate('prev_page');
    var next_page = translate('next_page');
    var optionsLength = mainMenu.length;
    var finalMenu = '';
    var currentMenu = '';
    var loc = 0;
    var counter = 1;
    var displayingMenu = {};
    var sessionMenu = {};
    for(var i = 1; i<=optionsLength ; i++){
        if(!(skipMenuOption(mainMenu[i].option_name))){
            var currentOption = mainMenu[i];
            currentMenu = finalMenu + String(counter) +') '+ currentOption.lang + '\n';

            if(currentMenu.length < max_chars){
                finalMenu = finalMenu + String(counter) + ') ' + currentOption.lang + '\n'
            }
            else{
                displayingMenu[loc] = finalMenu + next_page;
                finalMenu = prev_page + '\n' + String(counter) + ')' + currentOption.lang + '\n';
                loc = loc + 1;
            }
            sessionMenu.push(currentOption); 
        }
    }
    state.vars.sessionMenu = JSON.stringify(sessionMenu);
    if(Object.keys(displayingMenu).length > 0){
        displayingMenu[loc] = displayingMenu[loc] = finalMenu;
        return displayingMenu;
    }
    else{
        return finalMenu;
    }
}