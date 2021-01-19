var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var topTips = require('../../data/tips');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var selectedTip;

    switch(input) {
    case '1':
        selectedTip = topTips[4].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '2':
        selectedTip = topTips[5].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '3':
        selectedTip = topTips[6].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '4':
        selectedTip = topTips[7].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '0':
        playAudio(getAudioLink(lang, 'top-tips-part-2-menu'));
        promptKey('topTipsMenu2');
        break;
    case '*':
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
        break;
    default:
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('topTipsMenu2');
    }
};