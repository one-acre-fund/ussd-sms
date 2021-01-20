var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var topTips = require('../../data/tips');
var invalidAttempts = require('../../utils/invalidAttempts');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var selectedTip;

    switch(input) {
    case '1':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedTip = topTips[0].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '2':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedTip = topTips[1].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '3':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedTip = topTips[2].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '4':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedTip = topTips[3].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        playAudio(getAudioLink(lang, 'selected-tip-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '5':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, 'top-tips-part-2-menu'));
        promptKey('topTipsMenu2');
        break;
    case '0':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, 'top-tips-part-1-menu'));
        promptKey('topTipsMenu1');
        break;
    case '*':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
        break;
    default:
        invalidAttempts.check(state.vars.invalidInputAttempts, 2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('topTipsMenu1');
    }
};