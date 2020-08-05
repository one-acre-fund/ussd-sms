var createLocationsMenu = require('./createLocationMenu');

describe('Generate Locations Menu', () => {
    it('shoud create a menu', () => {
        var locations = {
            'gasabo': 'gasabo',
            'nyarugenge': 'nyarugenge',
            'kicukiro': 'kicukiro'
        };
        var output = createLocationsMenu(locations, 'Districts\n', 'en');
        expect(output.all_screens).toEqual({'1': 'Districts\n1) gasabo\n2) nyarugenge\n3) kicukiro\n'});
    });

    it('shoud create a multi screen menu for in case of many entries', () => {
        var manyLocations = {
            'gasabo': 'gasabo',
            'nyarugenge': 'nyarugenge',
            'kicukiro': 'kicukiro',
            'gasabo1': 'gasabo',
            'nyarugenge2': 'nyarugenge',
            'kicukiro3': 'kicukiro',
            'gasabo4': 'gasabo',
            'nyarugenge5': 'nyarugenge',
            'kicukiro6': 'kicukiro',
            'gasabo7': 'gasabo',
            'nyarugenge8': 'nyarugenge',
            'kicukiro9': 'kicukiro',
            'gasabo2': 'gasabo',
            'nyarugenge3': 'nyarugenge',
            'kicukiro4': 'kicukiro',
            'gasabo5': 'gasabo',
            'nyarugenge6': 'nyarugenge',
            'kicukiro7': 'kicukiro',
        };
        var output = createLocationsMenu(manyLocations, 'Districts\n', 'en');
        expect(Object.keys(output.all_screens).length).toBeGreaterThan(1);
    });
});