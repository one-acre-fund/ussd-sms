var translations = require('../translations/audio-translations');

/**
 * Gets the link to a particular audio file
 * @param {string} lang the preferred language for the audio
 * @param {string} key the name of the audio
 * @returns {string} the audio link
 */
module.exports = function (lang, key) {
    if (!lang) throw new Error('No default language provided');
    var entry = translations[key];
    if (entry === undefined) throw 'No Entry For "' + key + '"';
    if (lang === 'en-ke') {
        lang = 'en';
    }
    var link = entry[lang];
    if (link === undefined) throw '"' + lang + '" is not a supported language';

    return link;
};
