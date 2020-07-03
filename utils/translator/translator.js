function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function createTranslator(translations, defaultLanguage) {
    if (!translations) throw new Error('No Translations Provided');
    if (!defaultLanguage) throw new Error('No default language provided');
    var translate = function (key, options, lang) {
        var entry = translations[key];
        if (entry === undefined) throw 'No Entry For "' + key + '"';
        var template = entry[lang] || entry[defaultLanguage];
        if (template === undefined) throw 'No "' + lang + '" or "' + defaultLanguage + '" Translations For "' + key + '"';
        var text = template;
        if (options && Object.keys(options).length > 0) {
            Object.keys(options).forEach(function (subKey) {
                text = replaceAll(text, subKey, options[subKey]);
            });
        }
        return text;
    };
    return translate;
}

module.exports = createTranslator;