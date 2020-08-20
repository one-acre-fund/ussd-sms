var cropsInputHandler = require('./cropsInputHandler');

describe('Crops input handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt the user for a crop if their input doesn\'t match any crop', () => {
        state.vars.crops = JSON.stringify({'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'});
        cropsInputHandler('000');
        expect(sayText).toHaveBeenCalledWith('invalid input try again\nCrops\n' + 
        '1) Groundnuts\n' +
        '2) Rice\n' +
        '3) Pigeon peas\n');
        expect(promptDigits).toHaveBeenCalledWith('crops', {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });
    it('should prompt for varieties when the user chooses rice', () => {
        state.vars.crops = JSON.stringify({'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'});
        cropsInputHandler('2'); 
        expect(state.vars.selected_crop).toBe('Rice');
        expect(sayText).toHaveBeenCalledWith('Rice Varieties\n' + 
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

    it('should prompt user for Kgs to be sold once they select a crop other than rice', () => {
        state.vars.crops = JSON.stringify({'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'});
        cropsInputHandler('1'); 
        expect(state.vars.selected_crop).toBe('Groundnuts');
        expect(sayText).toHaveBeenCalledWith('Please enter the KGs that the client is selling, rounded to the closest number of KGs, as written on the contract');
        expect(promptDigits).toHaveBeenCalledWith('kgs', {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });
});