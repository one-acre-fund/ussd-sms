var notifyELK = require('../../../notifications/elk-notification');
var getAudioLink = require('../../utils/getAudioLink');
var episodes = require('../../data/episodes');

module.exports = function(input) {
    notifyELK();
    var lang = state.vars.lang;
    var selectedEpisode;

    switch(input) {
    case '1':
        selectedEpisode = episodes[episodes.length - 2].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '2':
        selectedEpisode = episodes[episodes.length - 3].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '3':
        selectedEpisode = episodes[episodes.length - 4].name;
        playAudio(getAudioLink(lang, selectedEpisode));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '4':
        selectedEpisode = episodes[episodes.length - 5].name;
        playAudio(getAudioLink(lang, selectedEpisode.name));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '5':
        selectedEpisode = episodes[episodes.length - 6].name;
        playAudio(getAudioLink(lang, selectedEpisode.name));
        state.vars.played = selectedEpisode;
        playAudio(getAudioLink(lang, 'selected-episode-menu'));
        promptKey('selectedTipOrEpisode2');
        break;
    case '6':
        playAudio(getAudioLink(lang, 'older-episodes-part-2-menu'));
        promptKey('olderEpisodesMenu2');
        break;
    case '0':
        playAudio(getAudioLink(lang, 'older-episodes-part-1-menu'));
        promptKey('olderEpisodesMenu1');
        break;
    case '*':
        playAudio(getAudioLink(lang, '2nd-flow-full-menu'));
        promptKey('2ndFlowMenuChoice');
        break;
    default:
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('olderEpisodesMenu1');
    }
};