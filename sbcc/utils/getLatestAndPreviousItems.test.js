const getLatestAndPreviousItems = require('./getLatestAndPreviousItems');

describe('Get latest and previous items in an array based on their dates', () => {
    var items = [
        {
            'name': 'item-1',
            'releaseDate': '01-25-2021'
        },
        {
            'name': 'item-2',
            'releaseDate': '01-29-2021'
        },
        {
            'name': 'item-3',
            'releaseDate': '02-08-2021'
        },
        {
            'name': 'item-4',
            'releaseDate': '08-22-2021'
        },
        {
            'name': 'item-5',
            'releaseDate': '03-08-2021'
        }
    ];

    it('returns empty object when empty array is passed as items', () => {
        var result = getLatestAndPreviousItems([], new Date());
        expect(result).toEqual({});
    });

    it('accurately returns latest and previous items', () => {
        var result = getLatestAndPreviousItems(items, new Date('02-07-2021'));
        expect(result).toEqual({
            latest: 'item-2',
            previous: 'item-1'
        });
    });

    it('does not include previous item in the result if the first item is the latest', () => {
        var result = getLatestAndPreviousItems(items, new Date('01-28-2021'));
        expect(result).toEqual({
            latest: 'item-1'
        });
    });

    it('returns last item as the latest if the current date is in far future', () => {
        var result = getLatestAndPreviousItems(items, new Date('12-12-2021'));
        expect(result).toEqual({
            latest: 'item-5',
            previous: 'item-4'
        });
    });

    it('returns empty object if current date is in the past', () => {
        var result = getLatestAndPreviousItems(items, new Date('12-31-2020'));
        expect(result).toEqual({});
    });

    it('throws error if items argument is not an array', () => {
        expect(() => getLatestAndPreviousItems({}, new Date())).toThrowError('items must be an array');
    });

    it('throws error if currentDate argument is not a valid date', () => {
        expect(() => getLatestAndPreviousItems([], new Date('something'))).toThrowError('currentDate is not a valid date');
    });
});