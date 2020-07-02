const createTranslator = require('./translator');

const exampleTranslations = {
    'simple': {
        en: 'Hi, Tester',
        sw: 'Niaje, Tester'
    },
    'another': {
        fr: 'bonjour',
        de: 'Guten tag'
    },
    'with-substitutions': {
        en: 'Should I call you $firstName or $lastName',
        sw: 'Ninapaswa Kukuita $firstName au $lastName',
    }
};

describe('createTranslator', () => {
    it('should be a function', () => {
        expect(createTranslator).toBeInstanceOf(Function);
    });
    it('should throw an error if there is no translations object', () => {
        expect(() => {
            createTranslator();
        }).toThrow('No Translations Provided');
    });
    it('should throw an error if there is no default tranlation key', () => {
        expect(() => {
            createTranslator(exampleTranslations);
        }).toThrow('No default language provided');
    });
    it('should return a translate function', () => {
        expect(createTranslator(exampleTranslations,'en')).toBeInstanceOf(Function);        
    });
    describe('translate', () => {
        var translate;
        beforeEach(() => {
            translate = createTranslator(exampleTranslations,'en');
        });
        it('should return the default translation if no language is provided', () => {
            expect(translate('simple')).toEqual(exampleTranslations.simple.en);
        });
        it('should return the selected language translation', () => {
            expect(translate('simple', {}, 'sw')).toEqual(exampleTranslations.simple.sw);
        });
        it('should throw an error if there is no text matching the translations  ', () => {
            expect(() => {
                translate('non-existent', {}, 'sw');
            }).toThrowError('No Entry For "non-existent"');
        });
        it('should return the default translation if non exists for the language provided', () => {
            expect(translate('simple', {}, 'ki')).toEqual(exampleTranslations.simple.en);
        });
        it('should throw an error if no translation exists in the default or given language', () => {
            expect(() => {
                translate('another', {}, 'sw');
            }).toThrowError('No "sw" or "en" Translations For "another"');
        });
        it('should replace template placeholders with corresponding values from options', () => {
            expect(translate('with-substitutions', {$firstName: 'clark',$lastName: 'kent'}, 'en')).toEqual(
                'Should I call you clark or kent'
            );
        });
        
    });
});