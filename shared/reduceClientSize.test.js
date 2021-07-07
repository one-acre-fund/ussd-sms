const reduceClientSize = require('./reduceClientSize');
const clientMock = {
    'GlobalClientId': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
    'AccountNumber': '10811688',
    'ClientName': 'N---------e, S-----n',
    'FirstName': 'S-----n',
    'LastName': 'N---------e',
    'NationalId': '16.04/94.885',
    'CreatedDate': '2015-05-04T16:34:50.873',
    'EnrollmentDate': '2015-05-04T16:34:50.873',
    'BannedDate': '2019-02-11T00:00:00',
    'DeceasedDate': null,
    'EarliestCreatedDate': '2015-05-04T16:34:50.873',
    'EarliestEnrollmentDate': '2015-05-04T16:34:50.873',
    'LatestBannedDate': '2019-02-11T00:00:00',
    'ClientId': 39947,
    'GroupId': 2083,
    'GroupName': 'Dukundane',
    'SiteId': 110,
    'SiteName': 'Nyarukere',
    'SectorId': 9,
    'SectorName': 'Rutegama Centre',
    'DistrictId': 2108,
    'DistrictName': 'Mbuye',
    'RegionId': 1108,
    'RegionName': 'Muramvya',
    'CountryId': 108,
    'CountryName': 'Burundi',
    'AccountHistory': [
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'ClientId': 39947,
            'AccountNumber': '10811688',
            'DistrictId': 2108,
            'DistrictName': 'Mbuye',
            'RegionId': 1108,
            'RegionName': 'Muramvya',
            'CountryId': 108,
            'CountryName': 'Burundi'
        },
        {
            'AccountGuid': '8c82bf3e-82c2-440b-8120-9f1341f55540',
            'ClientId': 26052,
            'AccountNumber': '10811688',
            'DistrictId': 4108,
            'DistrictName': 'Rutegama',
            'RegionId': 1108,
            'RegionName': 'Muramvya',
            'CountryId': 108,
            'CountryName': 'Burundi'
        }
    ],
    'BalanceHistory': [
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 280,
            'SeasonName': '2021B',
            'SeasonStart': '2021-03-01T00:00:00',
            'TotalCredit': 160700,
            'TotalCreditPerCycle': {
                '2021B': 160700
            },
            'TotalRepayment_IncludingOverpayments': 49000,
            'Balance': 111700,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 270,
            'SeasonName': '2021A',
            'SeasonStart': '2020-08-01T00:00:00',
            'TotalCredit': 42300,
            'TotalCreditPerCycle': {
                '2021A': 42300
            },
            'TotalRepayment_IncludingOverpayments': 44900,
            'Balance': -2600,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 260,
            'SeasonName': '2020B',
            'SeasonStart': '2020-03-01T00:00:00',
            'TotalCredit': 46800,
            'TotalCreditPerCycle': {
                '2020B': 46800
            },
            'TotalRepayment_IncludingOverpayments': 46800,
            'Balance': 0,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 250,
            'SeasonName': '2020A',
            'SeasonStart': '2019-08-01T00:00:00',
            'TotalCredit': 55700,
            'TotalCreditPerCycle': {
                '2020A': 55700
            },
            'TotalRepayment_IncludingOverpayments': 55700,
            'Balance': 0,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 240,
            'SeasonName': '2019B',
            'SeasonStart': '2019-03-01T00:00:00',
            'TotalCredit': 13600,
            'TotalCreditPerCycle': {
                '2019B': 13600
            },
            'TotalRepayment_IncludingOverpayments': 13600,
            'Balance': 0,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 230,
            'SeasonName': '2019A',
            'SeasonStart': '2018-09-01T00:00:00',
            'TotalCredit': 58600,
            'TotalCreditPerCycle': {
                '2019A': 58600
            },
            'TotalRepayment_IncludingOverpayments': 58600,
            'Balance': 0,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 220,
            'SeasonName': '2018B',
            'SeasonStart': '2018-03-01T00:00:00',
            'TotalCredit': 5600,
            'TotalCreditPerCycle': {
                '2018B': 5600
            },
            'TotalRepayment_IncludingOverpayments': 5600,
            'Balance': 0,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': 'e6e95b40-ad26-43b4-b778-11670b4a300f',
            'GroupId': 2083,
            'GroupName': 'Dukundane',
            'SiteId': 110,
            'SiteName': 'Nyarukere',
            'SeasonId': 210,
            'SeasonName': '2018A',
            'SeasonStart': '2017-09-01T00:00:00',
            'TotalCredit': 28900,
            'TotalCreditPerCycle': {
                '2018A': 28900
            },
            'TotalRepayment_IncludingOverpayments': 28900,
            'Balance': 0,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': '8c82bf3e-82c2-440b-8120-9f1341f55540',
            'GroupId': 1696,
            'GroupName': 'Dukundane',
            'SiteId': 88,
            'SiteName': 'Nyarukere',
            'SeasonId': 200,
            'SeasonName': '2017B',
            'SeasonStart': '2017-03-01T00:00:00',
            'TotalCredit': 0,
            'TotalCreditPerCycle': {
                '2017B': 0
            },
            'TotalRepayment_IncludingOverpayments': 37000,
            'Balance': -37000,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': '8c82bf3e-82c2-440b-8120-9f1341f55540',
            'GroupId': 1696,
            'GroupName': 'Dukundane',
            'SiteId': 88,
            'SiteName': 'Nyarukere',
            'SeasonId': 190,
            'SeasonName': '2017A',
            'SeasonStart': '2016-09-01T00:00:00',
            'TotalCredit': 0,
            'TotalCreditPerCycle': {
                '2017A': 0
            },
            'TotalRepayment_IncludingOverpayments': 45100,
            'Balance': -45100,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': '8c82bf3e-82c2-440b-8120-9f1341f55540',
            'GroupId': 1696,
            'GroupName': 'Dukundane',
            'SiteId': 88,
            'SiteName': 'Nyarukere',
            'SeasonId': 180,
            'SeasonName': '2016B',
            'SeasonStart': '2016-03-01T00:00:00',
            'TotalCredit': 0,
            'TotalCreditPerCycle': {
                '2016B': 0
            },
            'TotalRepayment_IncludingOverpayments': 66500,
            'Balance': -66500,
            'CurrencyCode': 'BIF'
        },
        {
            'AccountGuid': '8c82bf3e-82c2-440b-8120-9f1341f55540',
            'GroupId': 1696,
            'GroupName': 'Dukundane',
            'SiteId': 88,
            'SiteName': 'Nyarukere',
            'SeasonId': 170,
            'SeasonName': '2016A',
            'SeasonStart': '2015-09-01T00:00:00',
            'TotalCredit': 0,
            'TotalCreditPerCycle': {
                '2016A': 0
            },
            'TotalRepayment_IncludingOverpayments': 40700,
            'Balance': -40700,
            'CurrencyCode': 'BIF'
        }
    ]
};
describe('reduce client size', () => {
    it('should return a clonned client payload', () => {
        const clonnedClient = reduceClientSize(clientMock);
        expect(clonnedClient.AccountHistory.length).toBeLessThanOrEqual(3);
        expect(clonnedClient.BalanceHistory.length).toBeLessThanOrEqual(3);
    });
});
