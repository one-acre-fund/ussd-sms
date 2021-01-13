var getAudioLink = require('../utils/getAudioLink');

var lang = contact.vars.lang ? contact.vars.lang : 'sw';

// Start logic flow
global.main = function () {
    playAudio(getAudioLink(lang, 'welcome-message'));
    playAudio(getAudioLink(lang, 'main-menu-with-only-latest-ep'));
    promptKey('mainMenuChoice');
};

addInputHandler('mainMenuChoice', function(input) {
    if (input == '1') {
        playAudio(getAudioLink(lang, 'latest-episode-intro'));
        playAudio(getAudioLink(lang, 'latest-episode'));
        playAudio(getAudioLink(lang, 'latest-episode-recap'));
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('episodeMenuChoice');
    } else if (input == '0') {
        playAudio(getAudioLink(lang, 'main-menu-with-only-latest-ep'));
        promptKey('mainMenuChoice');
    } else {
        playAudio(getAudioLink(lang, 'invalid-option'));
        promptKey('mainMenuChoice');
    }
});

addInputHandler('episodeMenuChoice', function(input) {
    if (input == '0') {
        playAudio(getAudioLink(lang, 'latest-episode'));
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('episodeMenuChoice');
    } else if (input == '*') {
        playAudio(getAudioLink(lang, 'main-menu-with-only-latest-ep'));
        promptKey('mainMenuChoice');
    } else {
        playAudio(getAudioLink(lang, 'episode-menu'));
        promptKey('episodeMenuChoice');
    }
});