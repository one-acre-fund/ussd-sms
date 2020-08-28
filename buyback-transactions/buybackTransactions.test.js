var buybackTransactions = require('./buyBackTransactions');
var cropsInputHandler = require('./inputHandlers/cropsInputHandler');
var varietiesInputHandler = require('./inputHandlers/varietiesInputHandler');
var kgsInputHandler = require('./inputHandlers/kgsInputHandler');
var phoneNumberInputHandler = require('./inputHandlers/phoneNumberHandler');

describe('Buyback transactions', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en-mw'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should register the input handlers', () => {
        buybackTransactions.registerInputHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(cropsInputHandler.handlerName, cropsInputHandler.Handler);
        expect(addInputHandler).toHaveBeenCalledWith(varietiesInputHandler.handlerName, varietiesInputHandler.handler);
        expect(addInputHandler).toHaveBeenCalledWith(kgsInputHandler.handlerName, kgsInputHandler.handler);
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, phoneNumberInputHandler.handler);
    });

    it('should show a list of crops and prompt the user to select one', () => {
        buybackTransactions.start();
        expect(state.vars.crops).toBe('{"1":"Groundnuts","2":"Rice","3":"Pigeon peas"}');
        expect(sayText).toHaveBeenCalledWith('Crops\n' + 
        '1) Groundnuts\n' +
        '2) Rice\n' +
        '3) Pigeon peas\n');
        expect(promptDigits).toHaveBeenCalledWith(cropsInputHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 1
        });
    });
});