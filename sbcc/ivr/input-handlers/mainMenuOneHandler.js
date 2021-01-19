var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var mainMenu = state.vars.mainMenu;
    var latestEpisode = state.vars.latestEpisode;
    var previousEpisode = state.vars.previousEpisode;
    var latestTip = state.vars.latestTip;
    var previousTip = state.vars.previousTip;
    if (input == '1') {
        playAudio(getAudioLink(lang, latestEpisode + '-with-intro-and-recap'));
        state.vars.played = latestEpisode;
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '2' && (mainMenu === 'menu-with-prev-latest-ep-and-tip' || mainMenu === '1st-flow-full-menu')) {
        playAudio(getAudioLink(lang, latestTip));
        state.vars.played = latestTip;
        playAudio(getAudioLink(lang, 'tip-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '3' && (mainMenu === 'menu-with-only-latest-and-prev-ep' || mainMenu === 'menu-with-prev-latest-ep-and-tip' || mainMenu === '1st-flow-full-menu')) {
        playAudio(getAudioLink(lang, previousEpisode));
        state.vars.played = previousEpisode;
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '4' && mainMenu === '1st-flow-full-menu') {
        playAudio(getAudioLink(lang, previousTip));
        state.vars.played = previousTip;
        playAudio(getAudioLink(lang, 'tip-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '0') {
        playAudio(getAudioLink(lang, mainMenu));
        promptKey('1stFlowMenuChoice');
    } else {
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('1stFlowMenuChoice');
    }
};