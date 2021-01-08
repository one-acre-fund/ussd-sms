var translations = require('../translations/audio-translations');
var playTranslatedAudio = require('../utils/playTranslatedAudio');

var lang = contact.vars.lang ? contact.vars.lang : 'sw';

// Start logic flow
global.main = function () {
    playTranslatedAudio(translations, lang, 'welcome-message');
    playMenu(['latest-episode-option', 'latest-tip-option', 'previous-episode-option', 'previous-tip-option']);
    playTranslatedAudio(translations, lang, 'repeat-main-menu');
    promptKey('mainMenuChoice');
};

function playMenu(menuOptions) {
    menuOptions.forEach(function(option) {
        playTranslatedAudio(translations, lang, option);
    });
}

addInputHandler('mainMenuChoice', function(input) {
    if(input == '1') {
        playTranslatedAudio(translations, lang, 'latest-episode-intro');
    }
});