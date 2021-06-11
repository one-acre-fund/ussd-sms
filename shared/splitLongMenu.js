
/**
 * Returns a long Menu splitted in an array object
 * @param {Array} menuText an string to be splitted
 * @param {String} nextMenu next menu - to be added at the bottom of a splitted menu
 * @param {String} optionMenu A string containing the last options to be shown at the end
 * @param {Number} maxChar maximum characters of a screen 140 char by default
 */

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