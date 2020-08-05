var createFarmersMenu = require('./createFarmersMenu');

describe('Generate Locations Menu', () => {
    it('shoud create a farmers menu', () => {
        const farmers = {
            '1': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '2': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'}
        };
        const output = createFarmersMenu(farmers, 'Farmers\n', 'en');
        expect(output.all_screens).toEqual({'1': 'Farmers\n1) Brad Traversy\n2) Mosh Hamedani\n'});
    });

    it('should create multi screens menu for many entries', () => {
        const long_farmers_list = 
        {
            '1': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '2': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '3': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '4': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '5': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '6': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '7': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '8': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '9': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '10': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '11': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '12': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '13': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '14': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '15': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '16': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '17': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '18': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '19': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '20': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
            '21': {label: '1', first_name: 'Brad', last_name: 'Traversy'},
            '22': {label: '1', first_name: 'Mosh', last_name: 'Hamedani'},
        };
        const output = createFarmersMenu(long_farmers_list, 'Farmers\n', 'en');
        expect(Object.keys(output.all_screens).length).toBeGreaterThan(1);
    });
});