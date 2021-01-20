var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var invalidAttempts = require('../../utils/invalidAttempts');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var latestEpisode = state.vars.latestEpisode;
    if (input == '1') {
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, latestEpisode + '-with-intro-and-recap'));
        state.vars.played = latestEpisode;
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '2') {
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, 'older-episodes-part-1-menu'));
        promptKey('olderEpisodesMenu1');
    } else if (input == '3') {
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, 'top-tips-part-1-menu'));
        promptKey('topTipsMenu1');
    } else if (input == '0') {
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
    } else {
        invalidAttempts.check(state.vars.invalidInputAttempts, 2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('2ndFlowMenuChoice');
    }
};