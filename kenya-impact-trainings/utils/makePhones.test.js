const makePhones = require('./makePhones');

describe('make phones', () => {
    it('should accept a 9 digits phone', () => {
        const phones = makePhones('716263596');
        expect(phones).toEqual(['0716263596', '716263596', '254716263596', '+254716263596', '2540716263596', '+2540716263596']);
    });
    it('should accept a 10 digits phone', () => {
        const phones = makePhones('0716263596');
        expect(phones).toEqual(['0716263596', '716263596', '254716263596', '+254716263596', '2540716263596', '+2540716263596']);
    });
    it('should accept a 12 digits phone', () => {
        const phones = makePhones('254716263596');
        expect(phones).toEqual(['0716263596', '716263596', '254716263596', '+254716263596', '2540716263596', '+2540716263596']);
    });
    it('should accept a 12 digits phone with a + sign', () => {
        const phones = makePhones('+254716263596');
        expect(phones).toEqual(['0716263596', '716263596', '254716263596', '+254716263596', '2540716263596', '+2540716263596']);
    });
    it('should accept a 13 digits phone', () => {
        const phones = makePhones('2540716263596');
        expect(phones).toEqual(['0716263596', '716263596', '254716263596', '+254716263596', '2540716263596', '+2540716263596']);
    });
    it('should accept a 13 digits phone with a + sign', () => {
        const phones = makePhones('+2540716263596');
        expect(phones).toEqual(['0716263596', '716263596', '254716263596', '+254716263596', '2540716263596', '+2540716263596']);
    });
    it('should return an empty array if the phone is not valid', () => {
        const phones = makePhones('0000');
        expect(phones).toEqual([]);
    });
});
