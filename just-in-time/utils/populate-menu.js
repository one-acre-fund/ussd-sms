var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

module.exports = function(lang, max_chars, content){

    
    console.log('lang is:' +lang);
    var translate =  createTranslator(translations, lang);
    var prev_page = translate('prev_page', {}, lang);
    var next_page = translate('next_page', {}, lang);
    var title = translate('bundle_title', {}, lang);
    var optionsLength = content.length;
    var finalMenu = title+'';
    var currentMenu = '';
    var loc = 0;
    var counter = 1;
    var displayingMenu = {};
    var sessionMenu = [];
    for(var i = 0; i < optionsLength ; i++){
        var currentOption = content[i];
        currentMenu = finalMenu + String(counter) +') '+ currentOption.bundleName + ' '+ currentOption.price  + '\n';
        if(currentMenu.length < max_chars){
            finalMenu = finalMenu + String(counter) + ') ' + currentOption.bundleName + ' '+ currentOption.price  + '\n';
        }
        else{
            displayingMenu[loc] = finalMenu + next_page;
            finalMenu = prev_page + '\n' + String(counter) + ')' + currentOption.bundleName + ' '+ currentOption.price  + '\n';
            loc = loc + 1;
        }
        sessionMenu.push(currentOption);
        counter = counter + 1; 
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