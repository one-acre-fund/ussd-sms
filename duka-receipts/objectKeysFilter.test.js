var filter = require('./objectKeysFilter');

describe('Object keys filter', () => {
    it('should filer out the desired keys', () => {
        var mockObject = {'date': '2020-07-07',
            'netRowPrice1': '373.91','amount': 1720.01,
            'netRowPrice2': '1346.10',
            'unitPrice1': '400.00',
            'unitPrice2': '240.00',
            'netUnitPrice2': '240.00',
            'netUnitPrice1': '400.00',
            'rowPrice1': '373.91',
            'rowPrice2': '1346.10'};
        var keys = filter(mockObject, 'netUnitPrice');
        expect(keys).toHaveProperty('length');
        expect(keys.length).toEqual(2);
        expect(keys).toEqual(['netUnitPrice2', 'netUnitPrice1']);
    });
});