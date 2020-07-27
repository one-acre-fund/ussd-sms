
var receptionHandler = require('./receptionHandler');



describe('reception Handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    let mockFunction = jest.fn();

    let table_cursor = {
        currentIndex: -1,
        results: [{vars: {received_tester_pack: undefined}, save: mockFunction}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };


    it('should handle the right choice', () => {
        let table = {queryRows: () => table_cursor};
        project.initDataTableById = () => table;
        state.vars.selected_farmer = JSON.stringify({national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani'});
        receptionHandler(1);
        expect(mockFunction).toHaveBeenCalledWith();
        expect(table_cursor.results[0].vars.received_tester_pack).toEqual(true);
    });
    it('should handle the option for next', () => {
        table_cursor.currentIndex = -1;
        let table = {queryRows: () => table_cursor};
        project.initDataTableById = () => table;
        state.vars.selected_farmer = JSON.stringify({national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani'});
        receptionHandler(2);
        expect(mockFunction).toHaveBeenCalledWith();
        expect(table_cursor.results[0].vars.received_tester_pack).toEqual(false);
    });
});
