
var receptionHandler = require('./receptionHandler');


var mockedTable = { queryRows: jest.fn()};
var mockedRow = {save: jest.fn(),hasNext: jest.fn(), next: jest.fn(),vars: {'client_received_tester_pack': null,'received_tester_pack': null,'time_created_confirmation': null}}; 
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
        results: [{vars: {received_tester_pack: undefined, time_created_confirmation: null}, save: mockFunction}],
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
    it('should change the value of client_received_tester_pack to yes if the user chooses 2', () => {
    
        project.initDataTableById = jest.fn().mockReturnValue(mockedTable);
        mockedRow.next.mockReturnValue(mockedRow);
        mockedTable.queryRows.mockReturnValue(mockedRow);
        mockedRow.hasNext.mockReturnValue(true);
        project.initDataTableById = jest.fn().mockReturnValue(mockedTable);
        receptionHandler(2);
        expect(mockedRow.save).toHaveBeenCalledTimes(2);
        expect(mockedRow.vars.client_received_tester_pack).toEqual('no');
    });
    it('should change the value of client_received_tester_pack to yes if the client chooses 1', () => {
        receptionHandler(1);
        expect(mockedRow.save).toHaveBeenCalledTimes(2);
        expect(mockedRow.vars.client_received_tester_pack).toEqual('yes');
        expect(mockedRow.vars.time_created_confirmation).toEqual(new Date().toString());
    });
    it('should change the time created for confirmation and last updated to now if the client chooses 1 and it\'s the first time', () => {
        receptionHandler(1);
        expect(mockedRow.vars.time_created_confirmation).toEqual(new Date().toString());
        expect(mockedRow.vars.last_updated_confirmation).toEqual(new Date().toString());
    });
    it('should change set the time created for confirmation and last updated to now if the client chooses 2 and it\'s the first time', () => {
        receptionHandler(2);
        expect(mockedRow.vars.time_created_confirmation).toEqual(new Date().toString());
        expect(mockedRow.vars.last_updated_confirmation).toEqual(new Date().toString());
    });
    it('should change the time updated for confirmation to now if the client chooses 1 and it\'s not the first time', () => {
        mockedRow.vars.time_created_confirmation = new Date().toString();
        receptionHandler(1);
        expect(mockedRow.vars.last_updated_confirmation).toEqual(new Date().toString());
    });
    it('should change the time updated for confirmation to now if the client chooses 2 and it\'s not the first time', () => {
        mockedRow.vars.time_created_confirmation = new Date().toString();
        receptionHandler(2);
        expect(mockedRow.vars.last_updated_confirmation).toEqual(new Date().toString());
    });
});
