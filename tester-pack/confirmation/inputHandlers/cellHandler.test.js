
var cellHandler = require('./cellHandler');

describe('Cell handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    let table_cursor = {
        currentIndex: -1,
        results: [{vars: {village: 'Mpazi', villageid: 1}}, {vars: {village: 'Tetero', villageid: 2}}, {vars: {village: 'Kinyambo', villageid: 3}}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };

    it('should handle the right choice', () => {
        state.vars.cells = JSON.stringify({'1': 'Kora', '2': 'Kigarama', '3': 'Kabahizi'});
        state.vars.cells_screens = JSON.stringify({'1': '1) Kora\n2) Kigarama\n* Komeza', '2': '3) Kabahizi'});
        state.vars.current_cells_screen = 1;
        let table = {queryRows: () => table_cursor};
        project.getOrCreateDataTable = () => table;
        cellHandler(1);
        expect(state.vars.villages).toEqual('{"1":{"village_id":1,"village_name":"Mpazi"},"2":{"village_id":2,"village_name":"Tetero"},"3":{"village_id":3,"village_name":"Kinyambo"}}');
        expect(state.vars.villages).toEqual('{"1":{"village_id":1,"village_name":"Mpazi"},"2":{"village_id":2,"village_name":"Tetero"},"3":{"village_id":3,"village_name":"Kinyambo"}}');
        expect(state.vars.current_villages_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Village\n' +
        '1) Mpazi\n' +
        '2) Tetero\n' +
        '3) Kinyambo\n');
        expect(promptDigits).toHaveBeenCalledWith('select_village', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should handle the option for next', () => {
        state.vars.cells = JSON.stringify({'1': 'Kora', '2': 'Kigarama', '3': 'Kabahizi'});
        state.vars.cells_screens = JSON.stringify({'1': '1) Kora\n2) Kigarama\n* Komeza', '2': '3) Kabahizi'});
        state.vars.current_cells_screen = 1;
        let table = {queryRows: () => table_cursor};
        project.getOrCreateDataTable = () => table;
        cellHandler('*');
        expect(state.vars.current_cells_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Kabahizi');
        expect(promptDigits).toHaveBeenCalledWith('select_cell', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
