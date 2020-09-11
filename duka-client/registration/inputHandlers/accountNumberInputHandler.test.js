const accountNumberInputHandler = require('./accountNumberInputHandler');
const getClient = require('../../../shared/rosterApi/getClient');

jest.mock('../../../shared/rosterApi/getClient');

describe('Farmer\' account number input handler', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should prompt for the client\'s national id when the the chooses 0 for registering a new client', () => {
        const accountNumberHandler = accountNumberInputHandler.getHandler('en-ke', 'dev_credit_officers_table', {});
        accountNumberHandler(0);
        expect(sayText).toHaveBeenCalledWith('Enter client national ID\n');
        expect(promptDigits).toHaveBeenCalledWith( 'duka_client_nid', {'submitOnHash': false});
    });

    it('should register the user to a duka diistrict account once they already have an account number with OAF, and prompt them for an invoice id', () => {
        state.vars.dcr_duka_client = JSON.stringify({
            FirstName: 'client.FirstName',
            LastName: 'client.LastName',
            PhoneNumber: 'client.PhoneNumber',
            site: 'credit_officer_details.site',
            district: 'credit_officer_details.district'
        });
        const accountNumberHandler = accountNumberInputHandler.getHandler('en-ke', 'dev_credit_officers_table', {});
        accountNumberHandler(0);
        expect(sayText).toHaveBeenCalledWith('Please reply with the client\'s Erply Invoice ID');
        expect(promptDigits).toHaveBeenCalledWith( 'dcr_invoice_id', {'submitOnHash': false}); 
    });

    it('should reprompt for an account number once the user is not found in roster', () => {
        getClient.mockReturnValueOnce(null);
        const accountNumberHandler = accountNumberInputHandler.getHandler('en-ke', 'dev_credit_officers_table', {});
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith('Please reply with the account number of the farmer\n"0" for new client.');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'submitOnHash': false});
    });

    it('should notify the user if the farmer\' account is a non duka client and prompt them to register or enter a new account', () => {
        const clientWithNonDukaDistrict = {
            DistrictName: 'non-duka-district',
            FirstName: 'Aria',
            LastName: 'Stark',
        };
        contact.phone_number = '0722334535';
        getClient.mockReturnValueOnce(clientWithNonDukaDistrict);
        const cursor = {hasNext: jest.fn()};
        const table = {queryRows: jest.fn(() => cursor)};
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(false);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        const accountNumberHandler = accountNumberInputHandler.getHandler('en-ke', 'dev_credit_officers_table', {});
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith('You\'ve entered an account number for a non-duka account. Enter your duka account number or 0 to register as a duka client.');
        expect(state.vars.dcr_duka_client).toEqual('{"FirstName":"Aria","LastName":"Stark","PhoneNumber":"0722334535"}');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'submitOnHash': false}); 
    });

    it('should notify the user if the duka client\'s account number has outstanding credit', () => {
        const clientWithNonDukaDistrict = {
            DistrictName: 'non-duka-district',
            FirstName: 'Aria',
            LastName: 'Stark',
            BalanceHistory: [
                {Balance: 0},
                {Balance: 4540},
                {Balance: 3240}
            ]
        };
        contact.phone_number = '0722334535';
        getClient.mockReturnValueOnce(clientWithNonDukaDistrict);
        const cursor = {hasNext: jest.fn()};
        const table = {queryRows: jest.fn(() => cursor)};
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        const accountNumberHandler = accountNumberInputHandler.getHandler('en-ke', 'dev_credit_officers_table', {});
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith('You have a Duka credit account with an outstanding credit balance of 7780. Please complete your loan in order to take another one.');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should the user for invoice id if the duka client\'s account number has no outstanding credit', () => {
        const clientWithNonDukaDistrict = {
            DistrictName: 'non-duka-district',
            FirstName: 'Aria',
            LastName: 'Stark',
            BalanceHistory: [
                {Balance: 0},
                {Balance: 0},
                {Balance: 0}
            ]
        };
        contact.phone_number = '0722334535';
        getClient.mockReturnValueOnce(clientWithNonDukaDistrict);
        const cursor = {hasNext: jest.fn()};
        const table = {queryRows: jest.fn(() => cursor)};
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(true);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);

        const accountNumberHandler = accountNumberInputHandler.getHandler('en-ke', 'dev_credit_officers_table', {});
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith('Please reply with the client\'s Erply Invoice ID');
        expect(promptDigits).toHaveBeenCalledWith('dcr_invoice_id', {'submitOnHash': false});
    });
});