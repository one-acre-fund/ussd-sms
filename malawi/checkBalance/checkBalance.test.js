const nextScreenBalance = require('./inputHandlers/nextScreenBalance');
const checkBalance = require('./checkBalance');

const clientMock =  {'BalanceHistory': [
    {
        'AccountGuid': '9fcf207b-ae51-4113-878b-336e73975cb5',
        'GroupId': 549,
        'GroupName': 'Tugwizumwimbu',
        'SiteId': 37,
        'SiteName': 'Mpemba',
        'SeasonId': 280,
        'SeasonName': '2021B',
        'SeasonStart': '2021-03-01T00:00:00',
        'TotalCredit': 118400.000,
        'TotalCreditPerCycle': {
            '2021B': 118400.00
        },
        'TotalRepayment_IncludingOverpayments': 15000.0000,
        'Balance': 103400.0000,
        'CurrencyCode': 'BIF'
    },
    {
        'AccountGuid': '9fcf207b-ae51-4113-878b-336e73975cb5',
        'GroupId': 549,
        'GroupName': 'Tugwizumwimbu',
        'SiteId': 37,
        'SiteName': 'Mpemba',
        'SeasonId': 270,
        'SeasonName': '2021A',
        'SeasonStart': '2020-08-01T00:00:00',
        'TotalCredit': 149700.000,
        'TotalCreditPerCycle': {
            '2021A': 149700.00
        },
        'TotalRepayment_IncludingOverpayments': 149720.0000,
        'Balance': -20.0000,
        'CurrencyCode': 'BIF'
    },
    {
        'AccountGuid': '9fcf207b-ae51-4113-878b-336e73975cb5',
        'GroupId': 549,
        'GroupName': 'Tugwizumwimbu',
        'SiteId': 37,
        'SiteName': 'Mpemba',
        'SeasonId': 260,
        'SeasonName': '2020B',
        'SeasonStart': '2020-03-01T00:00:00',
        'TotalCredit': 58000.000,
        'TotalCreditPerCycle': {
            '2020B': 58000.00
        },
        'TotalRepayment_IncludingOverpayments': 58000.0000,
        'Balance': 0.0000,
        'CurrencyCode': 'BIF'
    }]};
describe('check balance', () => {
    it('should prompt for the next screen or sending an sms and save state variables', () => {
        checkBalance.start('en-mw', clientMock);
        expect(state.vars.current_season_balance).toEqual('1');
        expect(state.vars.balance_screens).toEqual('{"1":"Season: 2021B\\nCredit: 118400\\nRepaid: 15000\\nBalance: 103400\\n","2":"Season: 2021A\\nCredit: 149700\\nRepaid: 149720\\nBalance: -20\\n","3":"Season: 2020B\\nCredit: 58000\\nRepaid: 58000\\nBalance: 0\\n"}');
        expect(sayText).toHaveBeenCalledWith('Season: 2021B\n' +
        'Credit: 118400\n' +
        'Repaid: 15000\n' +
        'Balance: 103400\n' +
        '1) Next Season\n' +
        '2) Send to me via SMS');
        expect(promptDigits).toHaveBeenCalledWith(nextScreenBalance.handlerName);
    });
});
