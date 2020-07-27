
var provinceHandler = require('./provinceHandler');



describe('province handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    let table_cursor = {
        currentIndex: -1,
        results: [{vars: {district: 'Nyarugenge'}}, {vars: {district: 'Gasabo'}}, {vars: {district: 'Kicukiro'}}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };

    it('should handle the right choice', () => {
        state.vars.provinces = JSON.stringify({'2': 'Kigali'});
        let table = {queryRows: () => table_cursor};
        project.getOrCreateDataTable = () => table;
        provinceHandler(2);
        expect(state.vars.districts_screens).toEqual('{"1":"District\\n1) Nyarugenge\\n2) Gasabo\\n3) Kicukiro\\n"}');
        expect(state.vars.districts).toEqual('{"1":"Nyarugenge","2":"Gasabo","3":"Kicukiro"}');
        expect(state.vars.current_districts_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('District\n' +
        '1) Nyarugenge\n' +
        '2) Gasabo\n' +
        '3) Kicukiro\n');
        expect(promptDigits).toHaveBeenCalledWith('select_district', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
