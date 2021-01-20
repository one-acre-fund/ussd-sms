var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var invalidAttempts = require('../../utils/invalidAttempts');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var mainMenu = state.vars.mainMenu;
    var mainMenuHandler = state.vars.mainMenuHandler;
    var played = state.vars.played;
    var currentMenu = /tip/.test(played) ? 'tip-menu' : 'episode-menu';
    if (input == '0') {
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, played));
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '*') {
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, mainMenu));
        promptKey(mainMenuHandler);
    } else {
        invalidAttempts.check(state.vars.invalidInputAttempts, 2, lang);
        playAudio(getAudioLink(lang, 'invalid-option-2'));
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode1');
    }
};