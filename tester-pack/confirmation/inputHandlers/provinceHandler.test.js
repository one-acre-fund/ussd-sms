
var provinceHandler = require('./provinceHandler');



describe('province handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const table_cursor = {
        currentIndex: -1,
        results: [{vars: {district: 'Nyarugenge'}}, {vars: {district: 'Gasabo'}}, {vars: {district: 'Kicukiro'}}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };

    it('should prompt for the user to select a district from a list of districts that belongs to a selected province', () => {
        state.vars.provinces = JSON.stringify({'2': 'Kigali'});
        const cursor = {queryRows: () => table_cursor};
        jest.spyOn(cursor, 'queryRows');
        const table = jest.spyOn(project, 'getOrCreateDataTable');
        table.mockImplementation(() => cursor);
        provinceHandler(2);
        expect(cursor.queryRows).toHaveBeenCalledWith({'vars': {'provence': 'Kigali'}});
        expect(state.vars.districts_screens).toEqual('{"1":"District\\n1) Nyarugenge\\n2) Gasabo\\n3) Kicukiro\\n"}');
        expect(state.vars.districts).toEqual('{"1":"Nyarugenge","2":"Gasabo","3":"Kicukiro"}');
        expect(state.vars.current_districts_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('District\n' +
        '1) Nyarugenge\n' +
        '2) Gasabo\n' +
        '3) Kicukiro\n');
        expect(promptDigits).toHaveBeenCalledWith('select_district', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('shoult give another try for the user once the input doesn\t match any province', () => {
        state.vars.provinces = JSON.stringify({'2': 'Kigali'});
        provinceHandler('@');
        expect(sayText).toHaveBeenCalledWith('Invalid input. Try again\n' +
        'Province\n' +
        '1) EASTERN ZONE\n' +
        '2) KIGALI CITY\n' +
        '3) SOUTHERN ZONE\n' +
        '4) WESTERN ZONE\n' +
        '5) NORTHERN ZONE');
        expect(promptDigits).toHaveBeenCalledWith('select_province', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
