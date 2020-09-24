const getSectors = require('./getSectors');

describe.each(['en', 'ki'])('Get sectors util using (%s)', (lang) => {
    it('should return all the sectors list and screens menus --' + lang, () => {
        const table = {queryRows: jest.fn()};
        const cursor = {hasNext: jest.fn(), next: jest.fn()};
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {sector: 'Kings landing sector'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {sector: 'The Norhtern Sector'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {sector: 'The southern sector'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {sector: 'The eastern sector'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {sector: 'The western sector'}});

        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(cursor, 'next').mockReturnValueOnce({vars: {sector: 'The central city sector'}});

        var screens = {
            'en': {'1': 'Muhanga: Please select the Sector you live in.\n' +
            '1) Kings landing sector\n' +
            '2) The Norhtern Sector\n' +
            '3) The southern sector\n' +
            '77) next', '2': '4) The eastern sector\n' +
            '5) The western sector\n' +
            '6) The central city sector\n'},

            'ki': {'1': 'Muhanga: Hitamo umurege utuyemo\n' + 
            '1) Kings landing sector\n' +
            '2) The Norhtern Sector\n' +
            '3) The southern sector\n' +
            '4) The eastern sector\n' +
            '77) komeza', '2': '5) The western sector\n' +
            '6) The central city sector\n'
            }
        };
        jest.spyOn(table, 'queryRows').mockReturnValueOnce(cursor);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        var sectors = getSectors('Muhanga', 'table', lang);
        expect(sectors.list).toEqual({'1': 'Kings landing sector',
            '2': 'The Norhtern Sector', 
            '3': 'The southern sector', 
            '4': 'The eastern sector', 
            '5': 'The western sector', 
            '6': 'The central city sector'});
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith('table');
        expect(table.queryRows).toHaveBeenCalledWith({'vars': {'district': 'Muhanga'}});
        expect(sectors.screens).toEqual(screens[lang]);
    });
});