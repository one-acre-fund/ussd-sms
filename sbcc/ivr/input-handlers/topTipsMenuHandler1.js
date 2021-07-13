var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var topTips = require('../../data/tips');
var invalidAttempts = require('../../utils/invalidAttempts');
var addPlayedItem = require('../../utils/addPlayedItem');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    call.vars.topTipsMenuOneCount = call.vars.topTipsMenuOneCount ? call.vars.topTipsMenuOneCount + 1 : 1;
    var count = call.vars.topTipsMenuOneCount;
    var selectedTipMenu = 'selected-tip-menu';
    var selectedTip;

    switch(input) {
    case '1':
        invalidAttempts.clear();
        selectedTip = topTips[0].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        addPlayedItem(selectedTip);
        call.vars['topTipsMenuOnePlayed_' + count] = selectedTip;
        playAudio(getAudioLink(lang, selectedTipMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '2':
        invalidAttempts.clear();
        selectedTip = topTips[1].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        addPlayedItem(selectedTip);
        call.vars['topTipsMenuOnePlayed_' + count] = selectedTip;
        playAudio(getAudioLink(lang, selectedTipMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '3':
        invalidAttempts.clear();
        selectedTip = topTips[2].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        addPlayedItem(selectedTip);
        call.vars['topTipsMenuOnePlayed_' + count] = selectedTip;
        playAudio(getAudioLink(lang, selectedTipMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '4':
        invalidAttempts.clear();
        selectedTip = topTips[3].name;
        playAudio(getAudioLink(lang, selectedTip));
        state.vars.played = selectedTip;
        addPlayedItem(selectedTip);
        call.vars['topTipsMenuOnePlayed_' + count] = selectedTip;
        playAudio(getAudioLink(lang, selectedTipMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '5':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, 'top-tips-part-2-menu'));
        promptKey('topTipsMenu2');
        break;
    case '0':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, 'top-tips-part-1-menu'));
        promptKey('topTipsMenu1');
        break;
    case '*':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
        break;
    default:
        invalidAttempts.check(2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('topTipsMenu1');
    }
};
