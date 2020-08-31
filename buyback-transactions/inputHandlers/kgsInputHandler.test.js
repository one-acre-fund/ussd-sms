var kgsInputHandler = require('./kgsInputHandler');
var phoneNumberHandler = require('./phoneNumberHandler');

describe('Kgs input handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en-mw'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt the user for kgs if their input is not valid', () => {
        kgsInputHandler.handler('-5');
        expect(sayText).toHaveBeenCalledWith('Incorrect input. Please re-enter the number of KGs');
        expect(promptDigits).toHaveBeenCalledWith(kgsInputHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 10
        });
    });

    it('should show the payout details and prompt for a mobile money registered phone number', () => {
        state.vars.client = JSON.stringify({ClientName: 'Jon doe', BalanceHistory: [{balance: 4200}]});
        state.vars.selected_variety = JSON.stringify({price_per_kg: 250, crop: 'rice', variety: 'inyombe'});
        kgsInputHandler.handler(5);
        expect(sayText).toHaveBeenCalledWith('The client Jon doe has got an oustanding credit of 4200 MWK. The payout amount will be 2950 MWK. Please enter the mobile money account number');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 10
        });
    });

    it('should save the kgs into the transaction volume state vaiable', () => {
        state.vars.client = JSON.stringify({ClientName: 'Jon doe', BalanceHistory: [{balance: 4200}]});
        state.vars.selected_variety = JSON.stringify({price_per_kg: 250, crop: 'rice', variety: 'inyombe'});
        kgsInputHandler.handler(5);
        expect(state.vars.transaction_volume).toBe(5);
    });
});
