module.exports = function (menuText,nextMenu,optionMenu, maxChar){
    var screens = {};
    var i = 1;
    maxChar = maxChar || 140;
    nextMenu = nextMenu || '';
    optionMenu = optionMenu || '';
    var endChar = maxChar - nextMenu.length;
    while((menuText.length + optionMenu.length) >  maxChar){    
        screens[i++] = menuText.substring(0,endChar+1) +'\n'+ nextMenu;
        menuText = menuText.substring(endChar,menuText.length);
    }
    screens[i] = (menuText || '') + optionMenu;
    return screens;
}; 