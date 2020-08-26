
var farmerHandler = require('./farmerHandler');



describe('Farmer handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });


    it('should ask the user for their last 4 nid digits once they select a farmer', () => {
        state.vars.farmers = JSON.stringify({'1': {national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani' }});
        state.vars.farmers_screens = JSON.stringify({'1': '1) Mosh Hamedani\n2) Brad Traversy\n77) Komeza', '2': '3) Fun Function'});
        state.vars.current_cells_screen = 1;
        farmerHandler(1);
        expect(state.vars.selected_farmer).toEqual('{"national_id":"13753675","id":1,"first_name":"Mosh","last_name":"Hamedani"}');

        expect(sayText).toHaveBeenCalledWith('Please enter the last four digits of the national ID you registered with.');
        expect(promptDigits).toHaveBeenCalledWith('last_four_nid_digits', {'maxDigits': 4, 'submitOnHash': false, 'timeout': 10});
    });
    it('should display a next screen if the user selects 77', () => {
        state.vars.current_farmers_screen = 1;
        farmerHandler('77');
        expect(state.vars.current_farmers_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('3) Fun Function');
        expect(promptDigits).toHaveBeenCalledWith('select_farmer', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
    it('should ask the user to try again when their input doesn\' match any farmer', () => {
        state.vars.current_farmers_screen = 2;
        farmerHandler('@');
        expect(state.vars.current_farmers_screen).toEqual(2);
        expect(sayText).toHaveBeenCalledWith('Invalid input. Try again\n3) Fun Function');
        expect(promptDigits).toHaveBeenCalledWith('select_farmer', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
});
