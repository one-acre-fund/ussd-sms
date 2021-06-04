var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var invalidAttempts = require('../../utils/invalidAttempts');
var addPlayedItem = require('../../utils/addPlayedItem');

module.exports = function (input) {
    notifyELK();
    call.vars.mainMenuTwoHandlerCount = call.vars.mainMenuTwoHandlerCount ? call.vars.mainMenuTwoHandlerCount + 1 : 1;
    var count = call.vars.mainMenuTwoHandlerCount;
    var lang = state.vars.lang;
    var latestEpisode = state.vars.latestEpisode;
    if (input === '1') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, latestEpisode));
        state.vars.played = latestEpisode;
        addPlayedItem(latestEpisode);
        call.vars['mainMenuTwoPlayed_'+ count] = latestEpisode;
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input === '2') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, 'older-episodes-part-1-menu'));
        promptKey('olderEpisodesMenu1');
    } else if (input === '3') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, 'top-tips-part-1-menu'));
        promptKey('topTipsMenu1');
    } else if (input === '0') {
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
    } else {
        invalidAttempts.check(2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('2ndFlowMenuChoice');
    }
};
