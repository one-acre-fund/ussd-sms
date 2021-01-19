var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var played = state.vars.played;
    var currentMenu = /tip/.test(played) ? 'selected-tip-menu' : 'selected-episode-menu';
    var otherItemsMenu = currentMenu === 'selected-tip-menu' ? 'top-tips-part-1-menu' : 'older-episodes-part-1-menu';
    var otherItemsHandler = otherItemsMenu === 'top-tips-part-1-menu' ? 'topTipsMenu1' : 'olderEpisodesMenu1';

    if (input == '0') {
        playAudio(getAudioLink(lang, played));
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode2');
    } else if (input == '1') {
        playAudio(getAudioLink(lang, otherItemsMenu));
        promptKey(otherItemsHandler);
    } else if (input == '*') {
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
    } else {
        playAudio(getAudioLink(lang, currentMenu));
        promptKey('selectedTipOrEpisode2');
    }
};