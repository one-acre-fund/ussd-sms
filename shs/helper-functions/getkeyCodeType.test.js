const getShsPrice = require('./getShsPrice');
const getkeyCodeType = require('./getkeyCodeType');

jest.mock('./getShsPrice');

describe('get activation type', () => {
    it('should return an unlock code for KE if client paid in full', () => {
        const mockBalanceHistory = {
            'AccountGuid': '9f8faafd-8bd5-ef5f-b31a-85c9e919fdeb',
            'GroupId': 2450,
            'GroupName': 'huduma',
            'SiteId': 67,
            'SiteName': 'Uloma',
            'SeasonId': 280,
            'SeasonName': '2021, Long Rain',
            'SeasonStart': '2021-03-01T00:00:00',
            'TotalCredit': 11510.000,
            'TotalCreditPerCycle': {
                '2021, Long Rain': 11510.00
            },
            'TotalRepayment_IncludingOverpayments': 11510.00,
            'Balance': 0,
            'CurrencyCode': 'KES'

        };
        const result = getkeyCodeType('KE', mockBalanceHistory);
        expect(result).toEqual('UNLOCK');
    });

    it('should return an activation code for KE if client paid partial credit', () => {
        const mockBalanceHistory = {
            'AccountGuid': '9f8faafd-8bd5-ef5f-b31a-85c9e919fdeb',
            'GroupId': 2450,
            'GroupName': 'huduma',
            'SiteId': 67,
            'SiteName': 'Uloma',
            'SeasonId': 280,
            'SeasonName': '2021, Long Rain',
            'SeasonStart': '2021-03-01T00:00:00',
            'TotalCredit': 11510.000,
            'TotalCreditPerCycle': {
                '2021, Long Rain': 11510.00
            },
            'TotalRepayment_IncludingOverpayments': 11000.00,
            'Balance': 510,
            'CurrencyCode': 'KES'
        };
        const result = getkeyCodeType('KE', mockBalanceHistory);
        expect(result).toEqual('ACTIVATION');
    });

    it('should return an activation code for RW if they have not paid all credit', () => {
        getShsPrice.mockReturnValueOnce(30000);
        const mockBalanceHistory = {
            'AccountGuid': '748290e4-fd59-427c-9d2c-88e3a848eae3',
            'GroupId': 689,
            'GroupName': 'ABAHIZI',
            'SiteId': 4,
            'SiteName': 'Cyabajwa',
            'SeasonId': 290,
            'SeasonName': '2022',
            'SeasonStart': '2021-08-01T00:00:00',
            'TotalCredit': 24000.000,
            'TotalCreditPerCycle': {
                '2022A': 24000.00
            },
            'TotalRepayment_IncludingOverpayments': 0.0000,
            'Balance': 24000.0000,
            'CurrencyCode': 'RWF'
        };
        const result = getkeyCodeType('RW', mockBalanceHistory);
        expect(result).toEqual('ACTIVATION');
    });

    it('should return an unlock code for RW if they have paid all credit plus overpayment for shs', () => {
        getShsPrice.mockReturnValueOnce(40000);
        const mockBalanceHistory = {
            'AccountGuid': '748290e4-fd59-427c-9d2c-88e3a848eae3',
            'GroupId': 689,
            'GroupName': 'ABAHIZI',
            'SiteId': 4,
            'SiteName': 'Cyabajwa',
            'SeasonId': 290,
            'SeasonName': '2022',
            'SeasonStart': '2021-08-01T00:00:00',
            'TotalCredit': 24000.000,
            'TotalCreditPerCycle': {
                '2022A': 24000.00
            },
            'TotalRepayment_IncludingOverpayments': 64000.0000,
            'Balance': 0.0000,
            'CurrencyCode': 'RWF'
        };
        const result = getkeyCodeType('RW', mockBalanceHistory);
        expect(result).toEqual('UNLOCK');
    });

    it('should return an unlock code for RW if they have only ordered shs and paid it in full', () => {
        getShsPrice.mockReturnValueOnce(40000);
        const mockBalanceHistory ={
            'AccountGuid': '748290e4-fd59-427c-9d2c-88e3a848eae3',
            'GroupId': 689,
            'GroupName': 'ABAHIZI',
            'SiteId': 4,
            'SiteName': 'Cyabajwa',
            'SeasonId': 290,
            'SeasonName': '2022',
            'SeasonStart': '2021-08-01T00:00:00',
            'TotalCredit': 40000,
            'TotalCreditPerCycle': {
                '2022A': 40000
            },
            'TotalRepayment_IncludingOverpayments': 40000,
            'Balance': 0.0000,
            'CurrencyCode': 'RWF'
        };
        const result = getkeyCodeType('RW', mockBalanceHistory);
        expect(result).toEqual('UNLOCK');
    });
});