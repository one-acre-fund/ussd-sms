const accountNumberInputHandler = require('./accountNumberInputHandler');
const getClient = require('../../../shared/rosterApi/getClient');
var registerClient = require('../../../shared/rosterApi/registerClient');
var getPhoneNumbers = require('../../../shared/rosterApi/getPhoneNumber');
var nationalIdInputHandler = require('./nationalIdInputHandler');
var invoiceIdInputHandler = require('./invoiceIdInputHandler');

jest.mock('../../../shared/rosterApi/getClient');
jest.mock('../../../shared/rosterApi/registerClient');
jest.mock('../../../shared/rosterApi/getPhoneNumber');

describe.each(['en-ke', 'sw'])('Farmer\' account number input handler', (lang) => {
    beforeEach(() => {
        jest.resetAllMocks();
        getPhoneNumbers.mockReturnValueOnce([
            {
                'EntityType': 'ClientPhoneNumber',
                'ClientPhoneNumberId': 'e5bf8dc8-7aea-e911-80c6-14dda9d516dc',
                'GlobalClientId': '93737ec5-e90a-3397-2bb3-49cf1fd9d030',
                'PhoneNumberTypeId': 0,
                'PhoneNumber': '0722979024',
                'IsInactive': false,
                'InactiveDate': null
            },
            {
                'EntityType': 'ClientPhoneNumber',
                'ClientPhoneNumberId': 'e7bf8dc8-7aea-e911-80c6-14dda9d516dc',
                'GlobalClientId': '93737ec5-e90a-3397-2bb3-49cf1fd9d030',
                'PhoneNumberTypeId': 1,
                'PhoneNumber': '0722979025',
                'IsInactive': false,
                'InactiveDate': null
            }
        ]);
        state.vars = {};
    });

    it('should prompt for the client\'s national id when the the chooses 0 for registering a new client', () => {
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table', {});
        const messages = {
            'en-ke': 'Enter client national ID\n',
            'sw': 'Ingiza nambari ya kitambulisho cha kitaifa cha mteja\n'
        };
        accountNumberHandler(0);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(nationalIdInputHandler.handlerName, {'submitOnHash': false, maxDigits: 8});
    });

    it('should register the user to a duka district account once they already have an account number with OAF, and prompt them for an invoice id', () => {
        state.vars.dcr_duka_client = JSON.stringify({
            FirstName: 'client.FirstName',
            LastName: 'client.LastName',
            PhoneNumber: 'client.PhoneNumber',
            site: 'credit_officer_details.site',
            district: 'credit_officer_details.district'
        });
        const messages = {
            'en-ke': 'Please reply with the client\'s Erply Invoice ID',
            'sw': 'Tafadhali jibu na Kitambulisho cha mteja cha Erply Invoice'
        };
        registerClient.mockReturnValueOnce({});
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table', {});
        accountNumberHandler(0);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith( invoiceIdInputHandler.handlerName, {'submitOnHash': false}); 
    });

    it('should reprompt for the account number once the user is not successfully registered', () => {
        state.vars.dcr_duka_client = JSON.stringify({
            FirstName: 'client.FirstName',
            LastName: 'client.LastName',
            PhoneNumber: 'client.PhoneNumber',
            site: 'credit_officer_details.site',
            district: 'credit_officer_details.district'
        });
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table', {});
        const messages = {
            'en-ke': 'You\'ve entered an account number for a non-duka account. Enter your duka account number or 0 to register as a duka client.',
            'sw': 'Umeingiza nambari ya akaunti isiyo ya duka. Ingiza nambari yako ya akaunti ya duka au \'0\' ili ujiandikishe kama mteja wa duka.'
        };
        accountNumberHandler(0);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'submitOnHash': false}); 
    });

    it('should reprompt for an account number once the user is not found in roster', () => {
        getClient.mockReturnValueOnce(null);
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table', {});
        const messages = {
            'en-ke': 'Please reply with the account number of the farmer\n"0" for new client.',
            'sw': 'Tafadhali jibu na nambari ya akaunti ya mkulima\n"0" kwa mteja mpya.'
        };
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'submitOnHash': false});
    });

    it('should notify the user if the farmer\' account is a non duka client and prompt them to register or enter a new account', () => {
        const clientWithNonDukaDistrict = {
            DistrictName: 'non-duka-district',
            FirstName: 'Aria',
            LastName: 'Stark',
            NationalId: '3984752948'
        };
        getClient.mockReturnValueOnce(clientWithNonDukaDistrict);
        const cursor = {hasNext: jest.fn()};
        const table = {queryRows: jest.fn(() => cursor)};
        jest.spyOn(cursor, 'hasNext').mockReturnValueOnce(false);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValueOnce(table);
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table', {});
        const messages = {
            'en-ke': 'You\'ve entered an account number for a non-duka account. Enter your duka account number or 0 to register as a duka client.',
            'sw': 'Umeingiza nambari ya akaunti isiyo ya duka. Ingiza nambari yako ya akaunti ya duka au \'0\' ili ujiandikishe kama mteja wa duka.'
        };
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(state.vars.dcr_duka_client).toEqual('{"firstName":"Aria","lastName":"Stark","phoneNumber":"0722979024","nationalIdNumber":"DUKA-3984752948"}');
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

        const messages = {
            'en-ke': 'You have a Duka credit account with an outstanding credit balance of 7780. Please complete your loan in order to take another one.',
            'sw': 'Una akaunti ya mkopo ya Duka na salio bora la mkopo la X. Tafadhali kamilisha mkopo wako ili uchukue nyingine.'
        };

        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table', {});
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
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
        const messages = {
            'en-ke': 'Please reply with the client\'s Erply Invoice ID',
            'sw': 'Tafadhali jibu na Kitambulisho cha mteja cha Erply Invoice'
        };
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table', {});
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(invoiceIdInputHandler.handlerName, {'submitOnHash': false});
    });
});