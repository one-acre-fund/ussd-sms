const shsWarranty = require('./shs-warranty');

const serialNumberPromptMessage ={
    'en-ke': 'Enter the Serial number of your ProductEnter the Serial number of your Product',

    sw: 'Weka Serial number ya Bidhaa yako'
};

describe('shsWarrantty', () => {
    it('should have a registerhandlers function', () => {
        expect(shsWarranty.registerHandlers).toBeInstanceOf(Function);
    });
    it('should have a start function', () => {
        expect(shsWarranty.start).toBeInstanceOf(Function);
    });
    describe.each(['en-ke','sw'])('shsWarranty.start in (%s)',(lang) => {
        it('should show the warranty menu in '+lang, () => {
            shsWarranty.start(lang);
            expect(sayText).toHaveBeenCalledWith(serialNumberPromptMessage[lang]);               
        });
    });
});
