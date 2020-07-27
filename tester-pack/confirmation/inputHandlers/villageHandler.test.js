
var villageHandler = require('./villageHandler');

describe('Village handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    let table_cursor = {
        currentIndex: -1,
        results: [
            {vars: {national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani' }}, 
            {vars: {national_id: '11437284', id: 2, first_name: 'Brad', last_name: 'Traversy' }},
            {vars: {national_id: '11433948', id: 3, first_name: 'Fun', last_name: 'Function' }}],
        hasNext: () => table_cursor.results[table_cursor.currentIndex + 1] && true,
        next: () => { 
            table_cursor.currentIndex += 1;
            return table_cursor.results[table_cursor.currentIndex];
        }
    };

    it('should handle the right choice', () => {
        state.vars.villages = JSON.stringify({'1': {village: 'Mpazi', villageid: 1}, '2': {village: 'Tetero', villageid: 2}, '3': {village: 'Kinyambo', villageid: 3}});
        state.vars.villages_screen = JSON.stringify({'1': '1) Mpazi\n2) Tetero\n* Komeza', '2': '3) Kinyambo'});
        // state.vars.current_cells_screen = 1;
        let table = {queryRows: () => table_cursor};
        project.getOrCreateDataTable = () => table;
        villageHandler(1);
        expect(state.vars.farmers).toEqual('{"1":{"national_id":"13753675","first_name":"Mosh","last_name":"Hamedani","row_id":1},"2":{"national_id":"11437284",' + 
        '"first_name":"Brad","last_name":"Traversy","row_id":2},"3":{"national_id":"11433948","first_name":"Fun","last_name":"Function","row_id":3}}');
        
        expect(state.vars.villages).toEqual('{"1":{"village":"Mpazi","villageid":1},"2":{"village":"Tetero","villageid":2},"3":{"village":"Kinyambo","villageid":3}}');
        expect(state.vars.current_farmers_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Press the number corresponding to farmer who is receiving the tester pack\n' +
        '1) Mosh Hamedani\n' +
        '2) Brad Traversy\n' +
        '3) Fun Function\n');
        expect(promptDigits).toHaveBeenCalledWith('select_farmer', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
    it('should handle the option for next', () => {
        state.vars.villages = JSON.stringify({'1': {village: 'Mpazi', villageid: 1}, '2': {village: 'Tetero', villageid: 2}, '3': {village: 'Kinyambo', villageid: 3}});
        state.vars.villages_screen = JSON.stringify({'1': '1) Mpazi\n2) Tetero\n* Komeza', '2': '3) Kinyambo'});
        state.vars.current_villages_screen = 1;
        let table = {queryRows: () => table_cursor};
        project.getOrCreateDataTable = () => table;
        villageHandler('*');
        expect(state.vars.current_villages_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Kinyambo');
        expect(promptDigits).toHaveBeenCalledWith('select_village', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
