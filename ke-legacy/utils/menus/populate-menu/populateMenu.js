var mainMenu = require('./mainMenu');
var nonClientMenu = require('./nonClientMainMenu');
var createTranslator = require('../../../../utils/translator/translator');
var translations = require('../../../translations/index');
var CurrentSeasonName = '2020, Long Rain';

var chosenMenu;
var IsPrePayTrialDistrict= function(districtName){
    console.log('districtName:' + districtName);
    return districtName === 'Kipkelion' || districtName === 'Chwele';
};
var SHSActive = function (districtname){
    var Table = project.getOrCreateDataTable('SHS Districts');
    var Cursor = Table.queryRows({vars: {'districtname': districtname, 'active': '1'}});
    if (Cursor.count()>0){return true;}
    else {return false;}
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
var skipMenuOption = function(optionName){
    
    var optionMenu = '';
    chosenMenu.forEach(function(menu){
        if(menu.option_name == optionName){optionMenu = menu;}
    });
    if(!((Date.parse(new Date()) > Date.parse(new Date(String(optionMenu.start_date)))) && (Date.parse(new Date()) < Date.parse(new Date(String(optionMenu.end_date)))))){
        console.log('Failed because of dates-----------------'+optionMenu.option_name+ ' start:'+ Date.parse(new Date(String(optionMenu.start_date)))+ ' end: '+  Date.parse(new Date(String(optionMenu.end_date)))+ 'current'+ Date.parse(new Date()));
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
    else if(optionName == 'view_group_repayment'){
        if(!state.vars.isGroupLeader){
            return true;
        }
    }
    else if(optionName == 'top_up'){
        if(!state.vars.isGroupLeader){
            return true;
        }
    }
    else if(optionName == 'register_enroll_client'){
        if(!state.vars.isGroupLeader){
            return true;
        }
    }
    return false;
};

module.exports = function(lang, max_chars, isClient){

    console.log('lang is:' +lang);
    if(isClient){chosenMenu = mainMenu;}else{chosenMenu = nonClientMenu;}
    var translate =  createTranslator(translations, lang);
    var prev_page = translate('prev_page');
    var next_page = translate('next_page');
    var optionsLength = chosenMenu.length;
    var finalMenu = '';
    var currentMenu = '';
    var loc = 0;
    var counter = 1;
    var displayingMenu = {};
    var sessionMenu = [];
    for(var i = 0; i < optionsLength ; i++){
        if(!(skipMenuOption(chosenMenu[i].option_name))){
            var currentOption = chosenMenu[i];
            currentMenu = finalMenu + String(counter) +') '+ currentOption[lang]  + '\n';
            if(currentMenu.length < max_chars){
                finalMenu = finalMenu + String(counter) + ') ' + currentOption[lang] + '\n';
            }
            else{
                displayingMenu[loc] = finalMenu + next_page;
                finalMenu = prev_page + '\n' + String(counter) + ')' + currentOption[lang] + '\n';
                loc = loc + 1;
            }
            sessionMenu.push(currentOption);
            counter = counter + 1; 
        }
    }
    
    state.vars.sessionMenu = JSON.stringify(sessionMenu);
    console.log('menu:' +state.vars.sessionMenu);
    if(Object.keys(displayingMenu).length > 0){
        displayingMenu[loc] = displayingMenu[loc] = finalMenu;
        return displayingMenu;
    }
    else{
        console.log(finalMenu);
        return finalMenu;

    }
};