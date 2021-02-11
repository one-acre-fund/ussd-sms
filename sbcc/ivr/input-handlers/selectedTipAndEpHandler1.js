var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var invalidAttempts = require('../../utils/invalidAttempts');

module.exports = function (input) {
    notifyELK();
    var lang = state.vars.lang;
    var mainMenu = state.vars.mainMenu;
    var mainMenuHandler = state.vars.mainMenuHandler;
    var played = state.vars.played;
    var currentMenu = /tip/.test(played) ? 'tip-menu' : 'episode-menu';
    if (input === '0') {
        invalidAttempts.clear();
        console.log('now repeating ===>' + input);
        var repeatorMain = getAudioLink(lang, played);
        var repeated = getAudioLink(lang, currentMenu);
        console.log('first audio playing: ' + repeatorMain);
        playAudio(repeatorMain);
        console.log('second audio playing: ' + repeated);
        playAudio(repeated);
        state.vars.played = played;
        console.log('prompted key');
        promptKey('selectedTipOrEpisode1', {
            timeout: 1000
        });
        console.log('repeated now asking to repeat or main menu ===>');
    } else if (input === '*') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, mainMenu));
        promptKey(mainMenuHandler);
    } else {
        console.log('reached invalid '+ input);
        invalidAttempts.check(2, lang);
        playAudio(getAudioLink(lang, 'invalid-option-2'));
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode1');
    }
};
