var buybackTransactions = require('./buyBackTransactions');

describe('Buyback transactions', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should register the input handlers', () => {
        buybackTransactions.registerInputHandlers();

        var cropsInputHandler = require('./inputHandlers/cropsInputHandler');
        expect(addInputHandler).toHaveBeenCalledWith('crops', cropsInputHandler);
    });

    it('should show a list of crops and prompt the user to select one', () => {
        buybackTransactions.start();
        expect(state.vars.crops).toBe('{"1":"Groundnuts","2":"Rice","3":"Pigeon peas"}');
        expect(sayText).toHaveBeenCalledWith('Crops\n' + 
        '1) Groundnuts\n' +
        '2) Rice\n' +
        '3) Pigeon peas\n');
        expect(promptDigits).toHaveBeenCalledWith('crops', {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });
});