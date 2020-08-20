var varietiesInputHandler = require('./varietiesInputHandler');

describe('Varieties input handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt the user for a crop if their input doesn\'t match any variety', () => {
        state.vars.varieties = JSON.stringify({'1': 'Singapusa', '2': 'Tambala', '3': 'Amanda', '4': 'Kilombelo'});
        state.vars.varieties_menu = 'Rice Varieties\n' + 
        '1) Singapusa\n' + 
        '2) Tambala\n' + 
        '3) Amanda\n' +
        '4) Kilombelo\n';
        varietiesInputHandler('000');
        expect(sayText).toHaveBeenCalledWith('invalid input try again\n' + 
        'Rice Varieties\n' + 
        '1) Singapusa\n' + 
        '2) Tambala\n' + 
        '3) Amanda\n' +
        '4) Kilombelo\n');
        expect(promptDigits).toHaveBeenCalledWith('varieties', {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });

    it('should prompt for Kgs when the user chooses an existing variety', () => {
        state.vars.varieties = JSON.stringify({'1': 'Singapusa', '2': 'Tambala', '3': 'Amanda', '4': 'Kilombelo'});
        state.vars.varieties_menu = 'Rice Varieties\n' + 
        '1) Singapusa\n' + 
        '2) Tambala\n' + 
        '3) Amanda\n' +
        '4) Kilombelo\n';
        varietiesInputHandler('1');
        expect(state.vars.selected_variety).toBe('Singapusa');
        expect(sayText).toHaveBeenCalledWith('Please enter the KGs that the client is selling, rounded to the closest number of KGs, as written on the contract');
        expect(promptDigits).toHaveBeenCalledWith('kgs', {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });
});