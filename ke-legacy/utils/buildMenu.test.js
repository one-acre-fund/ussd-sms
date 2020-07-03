const menuBuilder = require('./build-menu');

describe('Build menu', () => {
    it('should return an array of menus when for many screens for characters > 140', () => {
        const menu = menuBuilder([{key: 'find_oaf_contact', options: {'$label': 1}},{key: 'find_oaf_contact', options: {'$label': 1}},
            {key: 'find_oaf_contact', options: {'$label': 1}},
            {key: 'find_oaf_contact', options: {'$label': 1}},
            {key: 'find_oaf_contact', options: {'$label': 1}}
        ]);
        expect(typeof menu).toEqual('object');
    });

    it('should return a string for one screen for characters <=140', () => {
        const menu = menuBuilder([
            {key: 'find_oaf_contact',options: {'$label': 1}},
            {key: 'find_oaf_contact', options: {'$label': 1}},
            {key: 'find_oaf_contact', options: {'$label': 1}},
        ]);
        expect(typeof menu).toEqual('string');
    });
});