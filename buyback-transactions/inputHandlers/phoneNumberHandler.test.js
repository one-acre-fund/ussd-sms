var phoneNumberInputHandler = require('./phoneNumberHandler');

describe('Phone number input handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en-mw'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt for phone number if input does not start with 088 or 099', () => {
        phoneNumberInputHandler.handler('0773245234');
        expect(sayText).toHaveBeenCalledWith('Invalid mobile money account number. Please enter a 10 digits phone number starting with 088 or 099');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 10
        });
    });

    it('should reprompt for phone number if input is not a 10 digits phone', () => {
        phoneNumberInputHandler.handler('09932452345');
        expect(sayText).toHaveBeenCalledWith('Invalid mobile money account number. Please enter a 10 digits phone number starting with 088 or 099');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName, {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 10
        });
    });

    it('should save and confirm that the transaction is recorded once the phone number is valid', () => {
        service.vars.buyback_transactions_table = 'ITD-123';
        state.vars.selected_variety = JSON.stringify({variety: 'rice variery1'});
        contact.phone_number = '0553245234';
        state.vars.transaction_volume = 25;
        state.vars.selected_crop = 'Rice';
        state.vars.first_name = 'Tyrion';
        state.vars.last_name = 'Lanyster';
        state.vars.account_number = '12345678';
        const rowMock = {save: jest.fn()};
        const tableMock = {createRow: jest.fn(() => rowMock)};
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(tableMock);
        phoneNumberInputHandler.handler('0883245234');
        expect(tableMock.createRow).toBeCalledWith({'vars': {
            'account_number': state.vars.account_number,
            'crop_type': state.vars.selected_crop,
            'first_name': state.vars.first_name,
            'last_name': state.vars.last_name,
            'mobile_money_phone': '0883245234',
            'session_phone': contact.phone_number,
            'transaction_volume': state.vars.transaction_volume,
            'variety_type': 'rice variery1'}});
        expect(rowMock.save).toHaveBeenCalled();
        expect(project.getOrCreateDataTable).toHaveBeenCalledWith(service.vars.buyback_transactions_table);
        expect(sayText).toHaveBeenCalledWith('Thank you. The transaction data has been recorded successfully. Please work with your agent to proceed with payment of the client');
        expect(stopRules).toHaveBeenCalled();
    });
});
