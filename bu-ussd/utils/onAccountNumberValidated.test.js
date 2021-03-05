const onAccountNumberValidated = require('./onAccountNumberValidated');
const {handlerName: mainMenuHandlerName} = require('../inputHandlers/mainMenuHandler');

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

const lang = 'en-bu';
describe('on account number validated', () => {
    it('should set the necessary state variables', () => {
        onAccountNumberValidated(lang, client);
        expect(state.vars.client_json).toEqual('{"GlobalClientId":"555312b8-b7c8-47b2-8861-1aa765b476a3","AccountNumber":"10367619","ClientName":"N-------a, C----e","FirstName":"C----e","LastName":"N-------a","NationalId":"000000000000","CreatedDate":"2015-04-22T12:19:49.493","EnrollmentDate":"2015-04-22T12:19:49.493","BannedDate":null,"DeceasedDate":null,"EarliestCreatedDate":"2015-04-22T12:19:49.493","EarliestEnrollmentDate":"2015-04-22T12:19:49.493","LatestBannedDate":null,"ClientId":373,"GroupId":62,"GroupName":"Kerebuka","SiteId":8,"SiteName":"Nyarumanga","SectorId":2,"SectorName":"Matongo Est","DistrictId":7108,"DistrictName":"Matongo","RegionId":1108,"RegionName":"Muramvya","CountryId":108,"CountryName":"Burundi","AccountHistory":[{"AccountGuid":"555312b8-b7c8-47b2-8861-1aa765b476a3","ClientId":373,"AccountNumber":"10367619","DistrictId":7108,"DistrictName":"Matongo","RegionId":1108,"RegionName":"Muramvya","CountryId":108,"CountryName":"Burundi"}],"BalanceHistory":[{"AccountGuid":"555312b8-b7c8-47b2-8861-1aa765b476a3","GroupId":62,"GroupName":"Kerebuka","SiteId":8,"SiteName":"Nyarumanga","SeasonId":170,"SeasonName":"2016A","SeasonStart":"2015-09-01T00:00:00","TotalCredit":0,"TotalCreditPerCycle":{},"TotalRepayment_IncludingOverpayments":0,"Balance":0,"CurrencyCode":"BIF"}]}');
        expect(state.vars.main_screens).toEqual('{"1":"Select a Service\\n1) Register New Client\\n2) Place Order\\n"}');
        expect(state.vars.current_main_screen).toEqual('1');
        expect(state.vars.main_option_values).toEqual('{"1":"registration","2":"place_order"}');
    });
    it('should prompt for main menu choice', () => {
        onAccountNumberValidated(lang, client);
        expect(sayText).toHaveBeenCalledWith('Select a Service\n' +
        '1) Register New Client\n' +
        '2) Place Order\n');
        expect(promptDigits).toHaveBeenCalledWith(mainMenuHandlerName);
    });
});
