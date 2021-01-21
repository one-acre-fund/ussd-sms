var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var getAudioLink = require('../../utils/getAudioLink');
var episodes = require('../../data/episodes');
var invalidAttempts = require('../../utils/invalidAttempts');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var selectedEpisodeMenu = 'selected-episode-menu';
    var selectedEpisode;

    switch(input) {
    case '1':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 2].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '2':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 3].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '3':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 4].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '4':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 5].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '5':
        invalidAttempts.clear();
        selectedEpisode = episodes[episodes.length - 6].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, selectedEpisodeMenu));
        promptKey('selectedTipOrEpisode2');
        break;
    case '6':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, 'older-episodes-part-2-menu'));
        promptKey('olderEpisodesMenu2');
        break;
    case '0':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, 'older-episodes-part-1-menu'));
        promptKey('olderEpisodesMenu1');
        break;
    case '*':
        invalidAttempts.clear();
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
        break;
    default:
        invalidAttempts.check(2, lang);
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('olderEpisodesMenu1');
    }
};
