const menuBuilder = require('./build-menu');

describe('Build menu', () => {
    it('should return an array of menus when for many screens for characters > 140', () => {
        const menu = menuBuilder([{key: 'find_oaf_contact', options: {'$label': 1}},{key: 'find_oaf_contact', options: {'$label': 2}},
            {key: 'find_oaf_contact', options: {'$label': 3}},
            {key: 'find_oaf_contact', options: {'$label': 4}},
            {key: 'find_oaf_contact', options: {'$label': 5}}
        ]);
        expect(typeof menu).toEqual('object');
        expect(menu).toHaveProperty('length');
        expect(menu.length).toBeGreaterThan(1);
        expect(menu).toEqual(['1) Find my One Acre Fund contact\n' +
        '2) Find my One Acre Fund contact\n' + 
        '3) Find my One Acre Fund contact\n' + 
        '4) Find my One Acre Fund contact\n', '5) Find my One Acre Fund contact\n']);
    });

    it('should return a string in case we have a single menu characters <=140', () => {
        const menu = menuBuilder([
            {key: 'find_oaf_contact',options: {'$label': 1}},
            {key: 'find_oaf_contact', options: {'$label': 2}},
            {key: 'find_oaf_contact', options: {'$label': 3}},
        ]);
        expect(typeof menu).toEqual('string');
        expect(menu).toEqual('1) Find my One Acre Fund contact\n' + 
        '2) Find my One Acre Fund contact\n' + 
        '3) Find my One Acre Fund contact\n');
    });
});