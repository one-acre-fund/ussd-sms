var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var latestEpisode = state.vars.latestEpisode;
    if (input == '1') {
        playAudio(getAudioLink(lang, latestEpisode + '-with-intro-and-recap'));
        state.vars.played = latestEpisode;
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('selectedTipOrEpisode1');
    } else if (input == '2') {
        playAudio(getAudioLink(lang, 'older-episodes-part-1-menu'));
        promptKey('olderEpisodesMenu1');
    } else if (input == '3') {
        playAudio(getAudioLink(lang, 'top-tips-part-1-menu'));
        promptKey('topTipsMenu1');
    } else if (input == '0') {
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
    } else {
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('2ndFlowMenuChoice');
    }
};