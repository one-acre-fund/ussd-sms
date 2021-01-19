var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var mainMenu = state.vars.mainMenu;
    var mainMenuHandler = state.vars.mainMenuHandler;
    var played = state.vars.played;
    var currentMenu = /tip/.test(played) ? 'tip-menu' : 'episode-menu';
    if (input == '0') {
        playAudio(getAudioLink(lang, played));
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '*') {
        playAudio(getAudioLink(lang, mainMenu));
        promptKey(mainMenuHandler);
    } else {
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode1');
    }
};