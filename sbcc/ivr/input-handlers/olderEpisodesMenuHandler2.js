var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var episodes = require('../../data/episodes');
var invalidAttempts = require('../../utils/invalidAttempts');
var addPlayedItem = require('../../utils/addPlayedItem');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    call.vars.olderEpisodesMenuTwoCount = call.vars.olderEpisodesMenuTwoCount ? call.vars.olderEpisodesMenuTwoCount + 1 : 1;
    var count = call.vars.olderEpisodesMenuTwoCount;
    var selectedEpisodeMenu = 'selected-episode-menu';
    var selectedEpisode;

    switch(input) {
    case '1':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 7].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        addPlayedItem(selectedEpisode);
        call.vars['olderEpisodesMenuTwoPlayed_' + count] = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '2':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 8].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        addPlayedItem(selectedEpisode);
        call.vars['olderEpisodesMenuTwoPlayed_' + count] = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '3':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 9].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        addPlayedItem(selectedEpisode);
        call.vars['olderEpisodesMenuTwoPlayed_' + count] = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '4':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 10].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        addPlayedItem(selectedEpisode);
        call.vars['olderEpisodesMenuTwoPlayed_' + count] = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '5':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 11].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        addPlayedItem(selectedEpisode);
        call.vars['olderEpisodesMenuTwoPlayed_' + count] = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '6':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 12].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        addPlayedItem(selectedEpisode);
        call.vars['olderEpisodesMenuTwoPlayed_' + count] = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '0':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, 'older-episodes-part-2-menu'));
        promptKey('olderEpisodesMenu2');
        break;
    case '*':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
        break;
    default:
        invalidAttempts.check(2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('olderEpisodesMenu2');
    }
};
