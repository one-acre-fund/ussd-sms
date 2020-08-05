
var cellHandler = require('./cellHandler');

describe('Cell handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const table_cursor = {
        currentIndex: -1,
        results: [{vars: {village: 'Mpazi', villageid: 1}}, {vars: {village: 'Tetero', villageid: 2}}, {vars: {village: 'Kinyambo', villageid: 3}}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };

    it('should prompt the user to select a village once the input matches a stored cell', () => {
        state.vars.cells = JSON.stringify({'1': 'Kora', '2': 'Kigarama', '3': 'Kabahizi'});
        state.vars.cells_screens = JSON.stringify({'1': '1) Kora\n2) Kigarama\n* Komeza', '2': '3) Kabahizi'});
        state.vars.current_cells_screen = 1;

        state.vars.provence = 2;
        state.vars.selected_district = 1;
        state.vars.selected_sector = 10;
        // state.vars.selected_Cell = 1;

        const cursor = {queryRows: () => table_cursor};
        jest.spyOn(cursor, 'queryRows');
        const table = jest.spyOn(project, 'getOrCreateDataTable');
        table.mockImplementation(() => cursor);
        cellHandler(1);
        expect(cursor.queryRows).toHaveBeenCalledWith({
            'vars': {
                'cell': 'Kora',
                'district': 1,
                'provence': 2,
                'sector': 10,
            },
        });
        expect(state.vars.villages).toEqual('{"1":{"village_id":1,"village_name":"Mpazi"},"2":{"village_id":2,"village_name":"Tetero"},"3":{"village_id":3,"village_name":"Kinyambo"}}');
        expect(state.vars.villages).toEqual('{"1":{"village_id":1,"village_name":"Mpazi"},"2":{"village_id":2,"village_name":"Tetero"},"3":{"village_id":3,"village_name":"Kinyambo"}}');
        expect(state.vars.current_villages_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Village\n' +
        '1) Mpazi\n' +
        '2) Tetero\n' +
        '3) Kinyambo\n');
        expect(promptDigits).toHaveBeenCalledWith('select_village', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should take the user to the next screen upon input of *', () => {
        state.vars.cells = JSON.stringify({'1': 'Kora', '2': 'Kigarama', '3': 'Kabahizi'});
        state.vars.cells_screens = JSON.stringify({'1': '1) Kora\n2) Kigarama\n* Komeza', '2': '3) Kabahizi'});
        state.vars.current_cells_screen = 1;
        project.getOrCreateDataTable = jest.fn();
        cellHandler('*');
        expect(state.vars.current_cells_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Kabahizi');
        expect(promptDigits).toHaveBeenCalledWith('select_cell', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should ask the user to retry when their input does\'t match any cell', () => {
        state.vars.cells = JSON.stringify({'1': 'Kora', '2': 'Kigarama', '3': 'Kabahizi'});
        state.vars.cells_screens = JSON.stringify({'1': '1) Kora\n2) Kigarama\n* Komeza', '2': '3) Kabahizi'});
        state.vars.current_cells_screen = 2;
        cellHandler('@');
        expect(state.vars.current_cells_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('Invalid input. Try again\n3) Kabahizi');
        expect(promptDigits).toHaveBeenCalledWith('select_cell', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
