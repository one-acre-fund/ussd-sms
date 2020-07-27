
var provinceHandler = require('./districtsHandler');



describe('Districts handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    let table_cursor = {
        currentIndex: -1,
        results: [{vars: {sector: 'Gitega'}}, {vars: {sector: 'Kimisagara'}}, {vars: {sector: 'Nyamirambo'}}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };

    it('should handle the right choice', () => {
        state.vars.districts = JSON.stringify({'1': 'Nyarugenge'});
        state.vars.districts_screens = JSON.stringify({'1': '1) Nyarugenge\n2) Gasabo\n* Komeza', '2': '3) Kicukiro'});
        let table = {queryRows: () => table_cursor};
        project.getOrCreateDataTable = () => table;
        provinceHandler(1);
        expect(state.vars.sectors_screens).toEqual('{"1":"Sector\\n1) Gitega\\n2) Kimisagara\\n3) Nyamirambo\\n"}');
        expect(state.vars.sectors).toEqual('{"1":"Gitega","2":"Kimisagara","3":"Nyamirambo"}');
        expect(state.vars.current_sectors_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Sector\n' +
        '1) Gitega\n' +
        '2) Kimisagara\n' +
        '3) Nyamirambo\n');
        expect(promptDigits).toHaveBeenCalledWith('select_sector', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should handle the option for next', () => {
        state.vars.districts = JSON.stringify({'1': 'Nyarugenge'});
        state.vars.districts_screens = JSON.stringify({'1': '1) Nyarugenge\n2) Gasabo\n* Komeza', '2': '3) Kicukiro'});
        state.vars.current_districts_screen = 1;
        let table = {queryRows: () => table_cursor};
        project.getOrCreateDataTable = () => table;
        provinceHandler('*');
        expect(state.vars.current_districts_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Kicukiro');
        expect(promptDigits).toHaveBeenCalledWith('select_district', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
