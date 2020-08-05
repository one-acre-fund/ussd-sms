
var villageIdHandler = require('./villageIdHandler');



describe('province handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });


    it('should give farmer promoter a number of registered and confirmed farmers once the village Id is correct ', () => {
        var table_cursor = {
            currentIndex: -1,
            results: [
                {vars: {first_name: 'Jon', last_name: 'Snow', received_tester_pack: true}},
                {vars: {first_name: 'Samuel', last_name: 'Tally', received_tester_pack: false}},
                {vars: {first_name: 'Ariah', last_name: 'Stark', received_tester_pack: true}}
            ],
            hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
            next: () => { 
                table_cursor.currentIndex += 1;
                return table_cursor.results[table_cursor.currentIndex];
            }
        };
        state.vars.provinces = JSON.stringify({'2': 'Kigali'});
        var cursor = {queryRows: () => table_cursor};
        jest.spyOn(cursor, 'queryRows');
        var table = jest.spyOn(project, 'initDataTableById');
        table.mockImplementation(() => cursor);
        villageIdHandler('23627432');
        const farmers = JSON.parse(state.vars.farmers); 
        expect(farmers.registered).toEqual({
            '1': {'first_name': 'Jon', 'last_name': 'Snow'},
            '2': {'first_name': 'Samuel', 'last_name': 'Tally'},
            '3': {'first_name': 'Ariah', 'last_name': 'Stark'}});
        expect(farmers.confirmed).toEqual({
            '1': {'first_name': 'Jon', 'last_name': 'Snow'}, 
            '2': {'first_name': 'Ariah', 'last_name': 'Stark'}});
        expect(sayText).toHaveBeenCalledWith('1) Registration= 3\n2) Confirmed= 2');
        expect(promptDigits).toHaveBeenCalledWith('registered_confirmed', {'maxDigits': 1, 'submitOnHash': false, 'timeout': 5});
    });

    it('should give farmer promoter another chance once the village id is incorect', () => {
        var table_cursor = {
            currentIndex: -1,
            results: [
            ],
            hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
            next: () => { 
                table_cursor.currentIndex += 1;
                return table_cursor.results[table_cursor.currentIndex];
            }
        };
        var cursor = {queryRows: () => table_cursor};
        jest.spyOn(cursor, 'queryRows');
        var table = jest.spyOn(project, 'initDataTableById');
        table.mockImplementation(() => cursor);
        villageIdHandler('000000'); 
        expect(sayText).toHaveBeenCalledWith('You entered a wrong village ID\nEnter village ID');
        expect(promptDigits).toHaveBeenCalledWith('village_id', {'maxDigits': 10, 'submitOnHash': false, 'timeout': 5});
    });
});
