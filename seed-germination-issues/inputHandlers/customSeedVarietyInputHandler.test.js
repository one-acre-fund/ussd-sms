const customSeedVarietyInputHandler = require('./customSeedVarietyInputHandler');
const lotCodeInputHandler = require('./lotCodeInputHandler');

describe.each(['en-ke', 'sw'])('custom seed variety input handler using (%s)', (lang) => {
    it('it should prompt for seed variety', () => {
        const handler = customSeedVarietyInputHandler.getHandler(lang);
        const seedVariety = 'variety1';
        const messages = {
            'en-ke': 'Please enter the seed lot code on the seed packet you have purchased. This code is on the packet of the seed and is usually comprised of letters and numbers. Press 0 if you cannot find the code.',
            'sw': 'Tafadhali ingiza nambari ya mbegu kwenye pakiti ya mbegu uliyonunua. Nambari hii iko kwenye pakiti ya mbegu na kawaida huwa na herufi na nambari. Bonyeza 0 ikiwa huwezi kupata nambari.'
        };
        handler(seedVariety);
        expect(state.vars.rsgi_seed_variety).toEqual(seedVariety);
        expect(promptDigits).toHaveBeenCalledWith(lotCodeInputHandler.handlerName);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
    });
});
