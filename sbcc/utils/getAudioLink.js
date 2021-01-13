var translations = require('../translations/audio-translations');

module.exports = function(lang, key) {
    if (!lang) throw new Error('No default language provided');
    var entry = translations[key];
    if (entry === undefined) throw 'No Entry For "' + key + '"';
    var link = entry[lang];
    if (link === undefined) throw '"' + lang + '" is not a supported language';

    return link;
};