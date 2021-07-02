var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var invalidAttempts = require('../../utils/invalidAttempts');
var addPlayedItem = require('../../utils/addPlayedItem');

module.exports = function (input) {
    notifyELK();
    var lang = state.vars.lang;
    call.vars.selectedItemMenuOneCount = call.vars.selectedItemMenuOneCount ? call.vars.selectedItemMenuOneCount + 1 : 1;
    var count = call.vars.selectedItemMenuOneCount;
    var mainMenu = state.vars.mainMenu;
    var mainMenuHandler = state.vars.mainMenuHandler;
    var played = state.vars.played;
    var currentMenu = /tip/.test(played) ? 'tip-menu' : 'episode-menu';
    if (input === '0') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, played));
        call.vars['selectedItemMenuOnePlayed_' + count] = played;
        addPlayedItem(played);
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode1');
    } else if (input === '*') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, mainMenu));
        promptKey(mainMenuHandler);
    } else {
        invalidAttempts.check(2, lang);
        playAudio(getAudioLink(lang, 'invalid-option-2'));
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode1');
    }
};
