const onAccountNumberValidated = require('./onAccountNumberValidated');
const mainMenuHandler = require('../inputHandlers/mainMenuHandler');

var clientMock = {
    'AccountNumber': '10469015',
    'BalanceHistory': [
        {
            'SeasonName': '2021B',
            'SeasonStart': '2021-03-01T00:00:00',
            'TotalCredit': 118400.000,
            'TotalRepayment_IncludingOverpayments': 15000.0000,
            'Balance': 103400.0000,
            'CurrencyCode': 'BIF'
        },
        {
            'SeasonName': '2021A',
            'SeasonStart': '2020-08-01T00:00:00',
            'TotalCredit': 149700.000,
            'TotalRepayment_IncludingOverpayments': 149720.0000,
            'Balance': -20.0000,
            'CurrencyCode': 'BIF'
        },
        {
            'SeasonName': '2020B',
            'SeasonStart': '2020-03-01T00:00:00',
            'TotalCredit': 58000.000,
            'TotalRepayment_IncludingOverpayments': 58000.0000,
            'Balance': 0.0000,
            'CurrencyCode': 'BIF'
        }]
};

describe('on account number validated util', () => {
    it('should save the necessary state variables', () => {
        onAccountNumberValidated('en-mw', clientMock);
        expect(state.vars.client_json).toEqual(JSON.stringify(clientMock));
        expect(state.vars.mw_main_screens).toEqual('{"1":"Select Service\\n1) Buy back\\n2) Check Balance\\n"}');
        expect(state.vars.mw_main_option_values).toEqual('{"1":"buy_back","2":"check_balance"}');
        expect(state.vars.current_mw_main_screen).toEqual('1');
    });
    it('should prompt for main menu handler', () => {
        onAccountNumberValidated('en-mw', clientMock);
        expect(sayText).toHaveBeenCalledWith('Select Service\n' +
        '1) Buy back\n' +
        '2) Check Balance\n');
        expect(promptDigits).toHaveBeenCalledWith(mainMenuHandler.handlerName);
    });
});
