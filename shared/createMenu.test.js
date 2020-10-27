const createMenu = require('./createMenu');

const optionsList = {'one_num': 'one number menu',
    'two_num': 'two number menu',
    'three_num': 'three number menu',
    'four_num': 'four number menu',
    'five_num': 'five number menu',
    'six_num': 'six number menu',
    'seven_num': 'seven number menu',
    'eight_num': 'eight number menu'};

describe('create menu', () => {
    it('should return the menu screens with options values', () => {
        const options = createMenu(optionsList);
        expect(options.screens).toEqual({'1': '1) one number menu\n' +
        '2) two number menu\n' +
        '3) three number menu\n' +
        '4) four number menu\n' +
        '5) five number menu\n' +
        '6) six number menu\n' +
        '7) seven number menu\n',
        '2': '8) eight number menu\n' 
        });
        expect(options.optionValues).toEqual({
            '1': 'one_num',
            '2': 'two_num',
            '3': 'three_num',
            '4': 'four_num', 
            '5': 'five_num',
            '6': 'six_num',
            '7': 'seven_num',
            '8': 'eight_num'});
    });

    it('should return the menu screens with next option when passed', () => {
        const options = createMenu(optionsList, '99) Next', 140);
        expect(options.screens).toEqual({'1': '1) one number menu\n' +
        '2) two number menu\n' +
        '3) three number menu\n' +
        '4) four number menu\n' +
        '5) five number menu\n' +
        '6) six number menu\n' +
        '99) Next',
        '2': '7) seven number menu\n' +
        '8) eight number menu\n' 
        });
    });
});

it('should return the menu screens with options values', () => {
    const options = createMenu(optionsList);
    expect(options.screens).toEqual({'1': '1) one number menu\n' +
    '2) two number menu\n' +
    '3) three number menu\n' +
    '4) four number menu\n' +
    '5) five number menu\n' +
    '6) six number menu\n' +
    '7) seven number menu\n',
    '2': '8) eight number menu\n' 
    });
});