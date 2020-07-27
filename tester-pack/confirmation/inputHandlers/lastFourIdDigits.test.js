
var lastFourIdDigitsHandler = require('./lastfourNidDigitsHandler');

describe('lastFourIdDigitsHandler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });


    it('should handle the right choice', () => {
        state.vars.selected_farmer = JSON.stringify({national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani'});
        lastFourIdDigitsHandler('3675');
        expect(sayText).toHaveBeenCalledWith('Has the farmer received the pack?\n1. Yes\n2. No');
        expect(promptDigits).toHaveBeenCalledWith('confirm_reception', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });
    it('should handle the option for next', () => {
        state.vars.selected_farmer = JSON.stringify({national_id: '13753675', id: 1, first_name: 'Mosh', last_name: 'Hamedani'});
        lastFourIdDigitsHandler('1192');
        expect(sayText).toHaveBeenCalledWith('You\'ve incorrectly entered the last four digits of your national ID. Please try again.');
        expect(promptDigits).toHaveBeenCalledWith('last_four_nid_digits', {'maxDigits': 4, 'submitOnHash': false, 'timeout': 10});
    });
});
