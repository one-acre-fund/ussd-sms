
var sectorHandler = require('./sectorsHandler');

describe('Sectors handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const table_cursor = {
        currentIndex: -1,
        results: [{vars: {cell: 'Kora'}}, {vars: {cell: 'Kigarama'}}, {vars: {cell: 'Kabahizi'}}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };

    it('should prompt a user for a cell when their input matches a stored sector', () => {
        state.vars.sectors = JSON.stringify({'1': 'Gitega', '2': 'Cyahafi', '3': 'Nyamirambo'});
        state.vars.sectors_screens = JSON.stringify({'1': '1) Gitega\n2) Cyahafi\n77) Komeza', '2': '3) Nyamirambo'});
        state.vars.selected_provence = 2;
        state.vars.selected_district = 1;
        const cursor = {queryRows: () => table_cursor};
        jest.spyOn(cursor, 'queryRows');
        const table = jest.spyOn(project, 'getOrCreateDataTable');
        table.mockImplementation(() => cursor);
        sectorHandler(1);

        expect(cursor.queryRows).toHaveBeenCalledWith({
            'vars': {
                'district': 1,
                'provence': 2,
                'sector': 'Gitega',
            },
        });
        expect(state.vars.cells_screens).toEqual('{"1":"Cell\\n1) Kora\\n2) Kigarama\\n3) Kabahizi\\n"}');
        expect(state.vars.cells).toEqual('{"1":"Kora","2":"Kigarama","3":"Kabahizi"}');
        expect(state.vars.current_cells_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Cell\n' +
        '1) Kora\n' +
        '2) Kigarama\n' +
        '3) Kabahizi\n');
        expect(promptDigits).toHaveBeenCalledWith('select_cell', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should handle the option for next screen', () => {
        state.vars.sectors = JSON.stringify({'1': 'Gitega', '2': 'Cyahafi', '3': 'Nyamirambo'});
        state.vars.sectors_screens = JSON.stringify({'1': '1) Gitega\n2) Cyahafi\n77) Komeza', '2': '3) Nyamirambo'});
        state.vars.current_sectors_screen = 1;
        project.getOrCreateDataTable = jest.fn();
        sectorHandler(77);
        expect(state.vars.current_sectors_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Nyamirambo');
        expect(promptDigits).toHaveBeenCalledWith('select_sector', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should ask a user to retry once their input doesn\'t match any sector', () => {
        state.vars.sectors = JSON.stringify({'1': 'Gitega', '2': 'Cyahafi', '3': 'Nyamirambo'});
        state.vars.sectors_screens = JSON.stringify({'1': '1) Gitega\n2) Cyahafi\n77) Komeza', '2': '3) Nyamirambo'});
        state.vars.current_sectors_screen = 2;
        project.getOrCreateDataTable = jest.fn();
        sectorHandler('@');
        expect(sayText).toHaveBeenCalledWith('Invalid input. Try again\n3) Nyamirambo');
        expect(promptDigits).toHaveBeenCalledWith('select_sector', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
