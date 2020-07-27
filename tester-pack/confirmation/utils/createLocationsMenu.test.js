var createLocationsMenu = require('./createLocationMenu');

describe('Generate Locations Menu', () => {
    it('shoud create a menu', () => {
        var locations = {
            'nyarugenge': 'nyarugenge',
            'gasabo': 'gasabo',
            'kicukiro': 'kicukiro',
            'ruhango': 'ruhango',
            'muhanga': 'muhanga',
            'nyamagabe': 'nyamagabe',
            'nyamasheke': 'nyamasheke',
            'kamonyi': 'kamonyi',
            'rutsiro': 'rutsiro',
            'gatsibo': 'gatsibo',
            'nyagatare': 'nyagatare',
            'musanze': 'musanze',
            'rubavu': 'rubavu',
            'gicumbi': 'gicumbi',
            'kirehe': 'kirehe'
        };
        var output = createLocationsMenu(locations, 'Districts\n', 'en');
        expect(typeof output).toBe('object');
    })
});