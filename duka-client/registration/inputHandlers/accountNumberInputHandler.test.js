const accountNumberInputHandler = require('./accountNumberInputHandler');
const getClient = require('../../../shared/rosterApi/getClient');
const registerClient = require('../../../shared/rosterApi/registerClient');
const getPhoneNumbers = require('../../../shared/rosterApi/getPhoneNumber');
const nationalIdInputHandler = require('./nationalIdInputHandler');
var transactionTypeInputHandler = require('./transactionTypeInputHandler');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../shared/rosterApi/getClient');
jest.mock('../../../shared/rosterApi/registerClient');
jest.mock('../../../shared/rosterApi/getPhoneNumber');
jest.mock('../../../notifications/elk-notification/elkNotification');

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
        state.vars.credit_officer_details = JSON.stringify({site_id: '123', district_id: '321'});
    });

    it('should call the elk', () => {
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        accountNumberHandler(0);
        expect(notifyElk).toHaveBeenCalled();
    });

    it('should prompt for the client\'s national id when the the chooses 0 for registering a new client', () => {
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
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
            firstName: 'client.FirstName',
            lastName: 'client.LastName',
            phoneNumber: '07887654376',
            site: 'credit_officer_details.site',
            district: 'credit_officer_details.district'
        });
        contact.phone_number = '077554433';
        const messages = {
            'en-ke': 'Is this a credit or layaway transaction?\n1) Credit\n2) Layaway',
            'sw': 'Je hii ni shughuli ya mkopo wa Credit au Layaway?\n1) Credit\n2) Layaway'
        };
        const sms = {
            'en-ke': 'Thank you for registering with OAF. Your Account Number is 27507544. The Duka team will help you complete your loan.',
            'sw': 'Asante kwa kusajili na OAF. Nambari yako ya Akaunti ni 27507544. Timu ya Duka itakusaidia kumaliza mkopo wako'
        };
        registerClient.mockReturnValueOnce({'AccountNumber': '27507544'});
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        accountNumberHandler(0);
        expect(project.scheduleMessage).toHaveBeenCalledWith({
            content: sms[lang], 
            to_number: '077554433',
            start_time_offset: 0
        });
        expect(project.scheduleMessage).toHaveBeenCalledWith({
            content: sms[lang], 
            to_number: '07887654376',
            start_time_offset: 15
        });
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith( transactionTypeInputHandler.handlerName, {'submitOnHash': false}); 
        expect(state.vars.account_number).toEqual('27507544');
        expect(state.vars.phone_number).toEqual('07887654376');
    });

    it('should register the user to a duka district account once they already have an account number with OAF, and ask them to complete their debt once they have an outstanding credit', () => {
        state.vars.dcr_duka_client = JSON.stringify({
            FirstName: 'client.FirstName',
            LastName: 'client.LastName',
            PhoneNumber: 'client.PhoneNumber',
            site: 'credit_officer_details.site',
            district: 'credit_officer_details.district'
        });
        state.vars.dcr_credit = 4500;
        const messages = {
            'en-ke': 'You have a Duka credit account with an outstanding credit balance of 4500. Please complete your loan in order to take another one.',
            'sw': 'Una akaunti ya mkopo ya Duka na salio bora la mkopo la 4500. Tafadhali kamilisha mkopo wako ili uchukue nyingine.'
        };
        registerClient.mockReturnValueOnce({});
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        accountNumberHandler(0);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(stopRules).toHaveBeenCalled(); 
    });

    it('should reprompt for the account number once the user is not successfully registered', () => {
        state.vars.dcr_duka_client = JSON.stringify({
            FirstName: 'client.FirstName',
            LastName: 'client.LastName',
            PhoneNumber: 'client.PhoneNumber',
            site: 'credit_officer_details.site',
            district: 'credit_officer_details.district'
        });
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        const messages = {
            'en-ke': 'You\'re already registered for a duka district. Please enter the client\'s duka account',
            'sw': 'Umesajiliwa kwa wilaya ya duka. Tafadhali ingiza nambari ya Akaunti ya duka'
        };
        accountNumberHandler(0);
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'submitOnHash': false}); 
    });

    it('should reprompt for an account number once the user is not found in roster', () => {
        getClient.mockReturnValueOnce(null);
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
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
            SiteName: 'NON-DUKA',
            DistrictName: 'non-duka-district',
            FirstName: 'Aria',
            LastName: 'Stark',
            NationalId: '3984752948',
            BalanceHistory: []
        };
        getClient.mockReturnValueOnce(clientWithNonDukaDistrict);
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        const messages = {
            'en-ke': 'You\'ve entered an account number for a non-duka account. Enter your duka account number or 0 to register as a duka client.',
            'sw': 'Umeingiza nambari ya akaunti isiyo ya duka. Ingiza nambari yako ya akaunti ya duka au \'0\' ili ujiandikishe kama mteja wa duka.'
        };
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(state.vars.dcr_duka_client).toEqual('{"firstName":"Aria","lastName":"Stark","phoneNumber":"0722979024","siteId":"123","districtId":"321","nationalIdNumber":"DUKA-3984752948"}');
        expect(promptDigits).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, {'submitOnHash': false}); 
    });

    it('should notify the user if the duka client\'s account number has outstanding credit', () => {
        const clientWithDukaDistrict = {
            DistrictName: 'duka-district',
            SiteName: 'Duka',
            FirstName: 'Aria',
            LastName: 'Stark',
            BalanceHistory: [
                {Balance: 0},
                {Balance: 4540},
                {Balance: 3240}
            ]
        };
        contact.phone_number = '0722334535';
        getClient.mockReturnValueOnce(clientWithDukaDistrict);

        const messages = {
            'en-ke': 'You have a Duka credit account with an outstanding credit balance of 7780. Please complete your loan in order to take another one.',
            'sw': 'Una akaunti ya mkopo ya Duka na salio bora la mkopo la 7780. Tafadhali kamilisha mkopo wako ili uchukue nyingine.'
        };

        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(stopRules).toHaveBeenCalled();
    });
    it('should notify the user if the duka client\'s account number has outstanding credit given that the site name is not duka and district name is OAF Duka', () => {
        const clientWithDukaDistrict = {
            DistrictName: 'OAF Duka',
            SiteName: 'nay site',
            FirstName: 'Aria',
            LastName: 'Stark',
            BalanceHistory: [
                {Balance: 0},
                {Balance: 4540},
                {Balance: 3240}
            ]
        };
        contact.phone_number = '0722334535';
        getClient.mockReturnValueOnce(clientWithDukaDistrict);

        const messages = {
            'en-ke': 'You have a Duka credit account with an outstanding credit balance of 7780. Please complete your loan in order to take another one.',
            'sw': 'Una akaunti ya mkopo ya Duka na salio bora la mkopo la 7780. Tafadhali kamilisha mkopo wako ili uchukue nyingine.'
        };

        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(stopRules).toHaveBeenCalled();
    });
    it('should notify the user if the duka client\'s account number has outstanding credit given that the site name is not duka and district name is OAF Duka', () => {
        const clientWithDukaDistrict = {
            DistrictName: 'OAF Duka',
            SiteName: 'nay site',
            FirstName: 'Aria',
            LastName: 'Stark',
            BalanceHistory: [
                {Balance: 0},
                {Balance: 4540},
                {Balance: 3240}
            ]
        };
        contact.phone_number = '0722334535';
        getClient.mockReturnValueOnce(clientWithDukaDistrict);

        const messages = {
            'en-ke': 'You have a Duka credit account with an outstanding credit balance of 7780. Please complete your loan in order to take another one.',
            'sw': 'Una akaunti ya mkopo ya Duka na salio bora la mkopo la 7780. Tafadhali kamilisha mkopo wako ili uchukue nyingine.'
        };

        const accountNumberHandler = accountNumberInputHandler.getHandler(lang);
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(stopRules).toHaveBeenCalled();
    });

    it('should the user for invoice id if the duka client\'s account number has no outstanding credit', () => {
        const clientWithDukaDistrict = {
            DistrictName: 'duka-district',
            SiteName: 'Duka',
            FirstName: 'Aria',
            LastName: 'Stark',
            BalanceHistory: [
                {Balance: 0},
                {Balance: 0},
                {Balance: 0}
            ]
        };
        contact.phone_number = '0722334535';
        getClient.mockReturnValueOnce(clientWithDukaDistrict);
        const messages = {
            'en-ke': 'Is this a credit or layaway transaction?\n1) Credit\n2) Layaway',
            'sw': 'Je hii ni shughuli ya mkopo wa Credit au Layaway?\n1) Credit\n2) Layaway'
        };
        const accountNumberHandler = accountNumberInputHandler.getHandler(lang, 'dev_credit_officers_table');
        accountNumberHandler('12345678');
        expect(sayText).toHaveBeenCalledWith(messages[lang]);
        expect(promptDigits).toHaveBeenCalledWith(transactionTypeInputHandler.handlerName, {'submitOnHash': false});
    });
});