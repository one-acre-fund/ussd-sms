var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var episodes = require('../../data/episodes');
var invalidAttempts = require('../../utils/invalidAttempts');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var selectedEpisode;

    switch(input) {
    case '1':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedEpisode = episodes[episodes.length - 7].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '2':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedEpisode = episodes[episodes.length - 8].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '3':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedEpisode = episodes[episodes.length - 9].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '4':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedEpisode = episodes[episodes.length - 10].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '5':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedEpisode = episodes[episodes.length - 11].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '6':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        selectedEpisode = episodes[episodes.length - 12].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '0':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, 'older-episodes-part-2-menu'));
        promptKey('olderEpisodesMenu2');
        break;
    case '*':
        invalidAttempts.clear(state.vars.invalidInputAttempts);
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
        break;
    default:
        invalidAttempts.check(state.vars.invalidInputAttempts, 2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('olderEpisodesMenu2');
    }
};