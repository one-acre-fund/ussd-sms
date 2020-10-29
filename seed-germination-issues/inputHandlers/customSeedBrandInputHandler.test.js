const customSeedBrandInputHandler = require('./customSeedBrandInputHandler');
const customSeedVarietyInputHandler = require('./customSeedVarietyInputHandler');

describe.each(['en-ke', 'sw'])('custom seed brand input handler using (%s)', (lang) => {
    it('it should prompt for seed variety', () => {
        const handler = customSeedBrandInputHandler.getHandler(lang);
        const seedBrand = 'brand1';
        const messages = {
            'sw': 'sw-Please write the name of the seed variety you purchased in the Duka.',
            'en-ke': 'Please write the name of the seed variety you purchased in the Duka.'
        };
        handler(seedBrand);
        expect(state.vars.rsgi_seed_brand).toEqual(seedBrand);
        expect(promptDigits).toHaveBeenCalledWith(customSeedVarietyInputHandler.handlerName);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
    });
});
