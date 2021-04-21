const onAccountNumberValidated = require('../../utils/onAccountNumberValidated');
const registerClient = require('../../../shared/rosterApi/registerClient');
const getPhoneNumber = require('../../../shared/rosterApi/getPhoneNumber');
const continueToOrderingHandler = require('./continueToOrderingHandler');
const registerConfirmationInputHandler = require('./registerConfirmationInputHandler');

jest.mock('../../utils/onAccountNumberValidated');
jest.mock('../../../shared/rosterApi/registerClient');
jest.mock('../../../shared/rosterApi/getPhoneNumber');
const groupInfo = {
    districtId: 1,
    siteId: 2,
    groupId: 3,
};

const client = {
    'GlobalClientId': '555312b8-b7c8-47b2-8861-1aa765b476a3',
    'AccountNumber': '10367619',
    'ClientName': 'N-------a, C----e',
    'FirstName': 'C----e',
    'LastName': 'N-------a',
    'NationalId': '000000000000',
    'CreatedDate': '2015-04-22T12:19:49.493',
    'EnrollmentDate': '2015-04-22T12:19:49.493',
    'BannedDate': null,
    'DeceasedDate': null,
    'EarliestCreatedDate': '2015-04-22T12:19:49.493',
    'EarliestEnrollmentDate': '2015-04-22T12:19:49.493',
    'LatestBannedDate': null,
    'ClientId': 373,
    'GroupId': 62,
    'GroupName': 'Kerebuka',
    'SiteId': 8,
    'SiteName': 'Nyarumanga',
    'SectorId': 2,
    'SectorName': 'Matongo Est',
    'DistrictId': 7108,
    'DistrictName': 'Matongo',
    'RegionId': 1108,
    'RegionName': 'Muramvya',
    'CountryId': 108,
    'CountryName': 'Burundi',
    'AccountHistory': [
        {
            'AccountGuid': '555312b8-b7c8-47b2-8861-1aa765b476a3',
            'ClientId': 373,
            'AccountNumber': '10367619',
            'DistrictId': 7108,
            'DistrictName': 'Matongo',
            'RegionId': 1108,
            'RegionName': 'Muramvya',
            'CountryId': 108,
            'CountryName': 'Burundi'
        }
    ],
    'BalanceHistory': [
        {
            'AccountGuid': '555312b8-b7c8-47b2-8861-1aa765b476a3',
            'GroupId': 62,
            'GroupName': 'Kerebuka',
            'SiteId': 8,
            'SiteName': 'Nyarumanga',
            'SeasonId': 170,
            'SeasonName': '2016A',
            'SeasonStart': '2015-09-01T00:00:00',
            'TotalCredit': 0.000,
            'TotalCreditPerCycle': {},
            'TotalRepayment_IncludingOverpayments': 0.0000,
            'Balance': 0.0000,
            'CurrencyCode': 'BIF'
        }
    ]
};
describe('register confirmation', () => {
    beforeEach(() => {
        state.vars.first_name = 'Tyrion';
        state.vars.last_name = 'Lanyster';
        state.vars.national_id = '1199728364743789723';
        state.vars.phone_number = '0788667349';
        contact.phone_number = '078836475822';
    });
    it('should reprompt for confirmation upon empty input', () => {
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerConfirmationHandler();
        expect(sayText).toHaveBeenCalledWith('I understood Group Constitution Rules\n' +
        '1) Continue\n' +
        '2) Back');
        expect(promptDigits).toHaveBeenCalledWith(registerConfirmationInputHandler.handlerName);
    });

    it('should reprompt for confirmation upon non numerical input', () => {
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerConfirmationHandler(' ashkjdhf ');
        expect(sayText).toHaveBeenCalledWith('I understood Group Constitution Rules\n' +
        '1) Continue\n' +
        '2) Back');
        expect(promptDigits).toHaveBeenCalledWith(registerConfirmationInputHandler.handlerName);
    });

    it('should end the session once the user is already registered', () => {
        state.vars.group_info = JSON.stringify(groupInfo);
        state.vars.duplicated_user = JSON.stringify({AccountNumber: '78363748'});
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerConfirmationHandler('1');
        expect(sayText).toHaveBeenCalledWith('you are already registered. your account number is 78363748');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should prompt for ordering once the registration is successfull', () => {
        state.vars.group_info = JSON.stringify(groupInfo);
        state.vars.duplicated_user = false;
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerClient.mockReturnValueOnce({AccountNumber: '78363748'});
        getPhoneNumber.mockReturnValueOnce([{IsInactive: false, PhoneNumber: '0780378599'}]);
        registerConfirmationHandler('1');
        expect( state.vars.registered_client_account).toEqual('78363748');
        expect(sayText).toHaveBeenCalledWith('Thank you for registering , your account number is 78363748, press 1 to continue or 0 to exit');
        expect(promptDigits).toHaveBeenCalledWith(continueToOrderingHandler.handlerName);
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': [
            {'content': 'Thank you for registering , your account number is 78363748',
                'to_number': '078836475822'},
            {'content': 'Thank you for registering , your account number is 78363748', 
                'to_number': '0780378599'}]});
    });

    it('should send the successful message to only the contact_phone if it is the same as the roster phone', () => {
        state.vars.group_info = JSON.stringify(groupInfo);
        state.vars.duplicated_user = false;
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerClient.mockReturnValueOnce({AccountNumber: '78363748'});
        getPhoneNumber.mockReturnValueOnce([{IsInactive: false, PhoneNumber: '078836475822'}]);
        registerConfirmationHandler('1');
        expect( state.vars.registered_client_account).toEqual('78363748');
        expect(sayText).toHaveBeenCalledWith('Thank you for registering , your account number is 78363748, press 1 to continue or 0 to exit');
        expect(promptDigits).toHaveBeenCalledWith(continueToOrderingHandler.handlerName);
        expect(project.sendMulti).toHaveBeenCalledWith({'messages': [
            {'content': 'Thank you for registering , your account number is 78363748',
                'to_number': '078836475822'}]});
    });

    it('should notify the user if there is an error during registration', () => {
        state.vars.group_info = JSON.stringify(groupInfo);
        state.vars.duplicated_user = false;
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerClient.mockImplementationOnce(() => {});
        registerConfirmationHandler('1');
        expect(sayText).toHaveBeenCalledWith('There was an error please try again/later');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should take user to the main menu once they select 2', () => {
        state.vars.client_json = JSON.stringify(client);
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerConfirmationHandler('2');
        expect(onAccountNumberValidated).toHaveBeenCalledWith('en_bu', client);
    });

    it('reprompt for register confirmation once they select invalid input', () => {
        const registerConfirmationHandler = registerConfirmationInputHandler.getHandler('en_bu');
        registerConfirmationHandler('000');
        expect(sayText).toHaveBeenCalledWith('I understood Group Constitution Rules\n' +
        '1) Continue\n' +
        '2) Back');
        expect(promptDigits).toHaveBeenCalledWith(registerConfirmationInputHandler.handlerName);
    });
    
});