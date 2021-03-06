var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var invalidAttempts = require('../../utils/invalidAttempts');
var addPlayedItem = require('../../utils/addPlayedItem');

module.exports = function(input) {
    notifyELK();
    call.vars.mainMenuOneHandlerCount = call.vars.mainMenuOneHandlerCount ? call.vars.mainMenuOneHandlerCount + 1 : 1;
    var count = call.vars.mainMenuOneHandlerCount;
    var lang = state.vars.lang;
    var mainMenu = state.vars.mainMenu;
    var latestEpisode = state.vars.latestEpisode;
    var previousEpisode = state.vars.previousEpisode;
    var latestTip = state.vars.latestTip;
    var previousTip = state.vars.previousTip;
    if (input === '1') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, latestEpisode));
        state.vars.played = latestEpisode;
        addPlayedItem(latestEpisode);
        call.vars['mainMenuOnePlayed_'+ count] = latestEpisode;
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input === '2' && (mainMenu === 'menu-with-prev-latest-ep-and-tip' || mainMenu === '1st-flow-full-menu')) {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, latestTip));
        state.vars.played = latestTip;
        addPlayedItem(latestTip);
        call.vars['mainMenuOnePlayed_'+ count] = latestTip;
        playAudio(getAudioLink(lang, 'tip-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input === '3' && (mainMenu === 'menu-with-only-latest-and-prev-ep' || mainMenu === 'menu-with-prev-latest-ep-and-tip' || mainMenu === '1st-flow-full-menu')) {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, previousEpisode));
        state.vars.played = previousEpisode;
        addPlayedItem(previousEpisode);
        call.vars['mainMenuOnePlayed_'+ count] = previousEpisode;
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input === '4' && mainMenu === '1st-flow-full-menu') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, previousTip));
        state.vars.played = previousTip;
        addPlayedItem(previousTip);
        call.vars['mainMenuOnePlayed_'+ count] = previousTip;
        playAudio(getAudioLink(lang, 'tip-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input === '0') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, mainMenu));
        promptKey('1stFlowMenuChoice');
    } else {
        invalidAttempts.check(2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('1stFlowMenuChoice');
    }
};
