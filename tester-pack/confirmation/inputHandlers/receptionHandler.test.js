
var receptionHandler = require('./receptionHandler');



describe('reception Handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const mockFunction = jest.fn();

    const table_cursor = {
        currentIndex: -1,
        results: [{vars: {received_tester_pack: undefined}, save: mockFunction}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };


    it('should change the value to true upon selection of 1', () => {
        const table = {queryRows: () => table_cursor};
        project.initDataTableById = () => table;
        state.vars.selected_farmer = JSON.stringify({national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani'});
        receptionHandler(1);
        expect(mockFunction).toHaveBeenCalledWith();
        expect(table_cursor.results[0].vars.received_tester_pack).toEqual(true);
    });
    it('should handle the option for next', () => {
        table_cursor.currentIndex = -1;
        const table = {queryRows: () => table_cursor};
        project.initDataTableById = () => table;
        state.vars.selected_farmer = JSON.stringify({national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani'});
        receptionHandler(2);
        expect(mockFunction).toHaveBeenCalledWith();
        expect(table_cursor.results[0].vars.received_tester_pack).toEqual(false);
    });
    it('should tell the user to try again once they select an unlisted option', () => {
        const table = {queryRows: () => table_cursor};
        project.initDataTableById = () => table;
        state.vars.selected_farmer = JSON.stringify({national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani'});
        receptionHandler(4);  
        expect(sayText).toHaveBeenCalledWith('Invalid input. Try again\nHas the farmer received the pack?\n1. Yes\n2. No');
        expect(promptDigits).toHaveBeenCalledWith('confirm_reception', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    });
});
