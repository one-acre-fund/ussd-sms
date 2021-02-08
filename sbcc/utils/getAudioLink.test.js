const getAudioLink = require('./getAudioLink');

describe('Get Audio Link', () => {
    it('returns the correct audio link for english', () => {
        var link = getAudioLink('en', 'error');
        expect(link).toEqual(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611061658/4868df5e9317/error.mp3'
        );
    });

    it('returns the correct audio link for swahili', () => {
        var link = getAudioLink('sw', 'error');
        expect(link).toEqual(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611061811/8ffa907050bd/error_SWA.mp3'
        );
    });

    it('throws error if language is not provided', () => {
        expect(() => getAudioLink('', 'no-response')).toThrowError(
            'No default language provided'
        );
    });

    it('throws error if the provided key does not exist', () => {
        var key = 'my-menu';
        expect(() => getAudioLink('en', key)).toThrowError(
            `No Entry For "${key}"`
        );
    });

    it('throws error if the provided language is not supported', () => {
        var lang = 'fr';
        expect(() => getAudioLink(lang, 'no-response')).toThrowError(
            `"${lang}" is not a supported language`
        );
    });

    it('returns the correct english audio when lang is en-ke', () => {
        var link = getAudioLink('en-ke', 'error');
        expect(link).toEqual(
            'https://telerivet.s3.amazonaws.com/files/PJ0c6396c97da49774/1611061658/4868df5e9317/error.mp3'
        );
    });
});
