
var villageHandler = require('./villageHandler');

describe('Village handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    const table_cursor = {
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

    it('should promt the user to select a farmer once the input matches an existinf village', () => {
        state.vars.villages = JSON.stringify({'1': {village: 'Mpazi', village_id: 1}, '2': {village: 'Tetero', village_id: 2}, '3': {village: 'Kinyambo', village_id: 3}});
        state.vars.villages_screen = JSON.stringify({'1': '1) Mpazi\n2) Tetero\n77) Komeza', '2': '3) Kinyambo'});
        const table = {queryRows: () => table_cursor};
        project.initDataTableById = () => table;
        villageHandler(1);
        expect(state.vars.farmers).toEqual('{"1":{"national_id":"13753675","first_name":"Mosh","last_name":"Hamedani","row_id":1},"2":{"national_id":"11437284",' + 
        '"first_name":"Brad","last_name":"Traversy","row_id":2},"3":{"national_id":"11433948","first_name":"Fun","last_name":"Function","row_id":3}}');
        
        expect(state.vars.villages).toEqual('{"1":{"village":"Mpazi","village_id":1},"2":{"village":"Tetero","village_id":2},"3":{"village":"Kinyambo","village_id":3}}');
        expect(state.vars.current_farmers_screen).toEqual(1);
        expect(sayText).toHaveBeenCalledWith('Press the number corresponding to farmer who is receiving the tester pack\n' +
        '1) Mosh Hamedani\n' +
        '2) Brad Traversy\n' +
        '3) Fun Function\n');
        expect(promptDigits).toHaveBeenCalledWith('select_farmer', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should tell the user if there are no registered farmers in the selected village', () => {
        state.vars.villages = JSON.stringify({'1': {village_name: 'Mpazi', village_id: 1}, '2': {village_name: 'Tetero', village_id: 2}, '3': {village_name: 'Kinyambo', village_id: 3}});
        state.vars.villages_screen = JSON.stringify({'1': '1) Mpazi\n2) Tetero\n77) Komeza', '2': '3) Kinyambo'});
        table_cursor.results = [];
        const table = {queryRows: () => table_cursor};
        project.initDataTableById = () => table;
        villageHandler(1);
        expect(sayText).toHaveBeenCalledWith('No registered farmers in Mpazi village');
        expect(stopRules).toHaveBeenCalled();
        expect(promptDigits).not.toHaveBeenCalled();
    });

    it('should display a next page when a user inputs 77', () => {
        state.vars.villages = JSON.stringify({'1': {village: 'Mpazi', village_id: 1}, '2': {village: 'Tetero', village_id: 2}, '3': {village: 'Kinyambo', village_id: 3}});
        state.vars.villages_screen = JSON.stringify({'1': '1) Mpazi\n2) Tetero\n77) Komeza', '2': '3) Kinyambo'});
        state.vars.current_villages_screen = 1;
        project.initDataTableById = jest.fn();
        villageHandler(77);
        expect(state.vars.current_villages_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Kinyambo');
        expect(promptDigits).toHaveBeenCalledWith('select_village', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should display a next page when a user inputs 77', () => {
        state.vars.villages = JSON.stringify({'1': {village: 'Mpazi', village_id: 1}, '2': {village: 'Tetero', village_id: 2}, '3': {village: 'Kinyambo', village_id: 3}});
        state.vars.villages_screen = JSON.stringify({'1': '1) Mpazi\n2) Tetero\n77) Komeza', '2': '3) Kinyambo'});
        state.vars.current_villages_screen = 2;
        project.initDataTableById = jest.fn();
        villageHandler('@');
        expect(state.vars.current_villages_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('Invalid input. Try again\n3) Kinyambo');
        expect(promptDigits).toHaveBeenCalledWith('select_village', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
