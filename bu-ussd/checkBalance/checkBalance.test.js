const checkBalance = require('./checkBalance');
const getHealthyPathMessage = require('../../healthy-path/balance/healthyPathOnBalance');

jest.mock('../../healthy-path/balance/healthyPathOnBalance');

const clientMock = {
    'AccountNumber': '25799722',
    'ClientName': 'Tyrion Lnyster',
    'FirstName': 'Tyrion',
    'LastName': 'Lanyster',
    'LatestBannedDate': null,'ClientId': 1038000165,
    'GroupId': 1038000019,'GroupName': 'Barikui Staff',
    'SiteId': 38,'SiteName': 'Barier','SectorId': 9,
    'SectorName': 'Eutycus Kimathi','DistrictId': 48404,
    'DistrictName': 'Imenti','RegionId': 5404,'RegionName': 'Gitega',
    'CountryId': 108,'CountryName': 'Burundi',
    'BalanceHistory': [
        {'AccountGuid': 'cd7bffc4-f95c-5941-ae57-07fb791fd3b4',
            'GroupId': 1038000019,'GroupName': 'Barikui Staff',
            'SiteId': 38,'SiteName': 'Barier','SeasonId': 280,
            'SeasonName': '2021, Long Rain','SeasonStart': '2021-03-01T00:00:00',
            'TotalCredit': 11011,'TotalCreditPerCycle': {'2021, Long Rain': 11011},
            'TotalRepayment_IncludingOverpayments': 1760,'Balance': 9251,'CurrencyCode': 'BIF'},
        {'AccountGuid': 'cd7bffc4-f95c-5941-ae57-07fb791fd3b4','GroupId': 1038000019,
            'GroupName': 'Barikui Staff','SiteId': 38,'SiteName': 'Barier','SeasonId': 260,
            'SeasonName': '2020, Long Rain','SeasonStart': '2020-03-01T00:00:00',
            'TotalCredit': 4015,'TotalCreditPerCycle': {'2020, Long Rain': 4015},
            'TotalRepayment_IncludingOverpayments': 4015,'Balance': 0,'CurrencyCode': 'BIF'}]};


describe('check balance', () => {
    it('should show the popup and send the message of the balance', () => {
        contact.phone_number = '0787654565';
        getHealthyPathMessage.mockReturnValueOnce('Healthy Path Status: 250 below healthy path\n');
        checkBalance('en_bu', clientMock);
        var message = 'Hello Tyrion Lanyster\n' +
        'Credit: 11011\n' +
        'Paid: 1760\n' +
        'Balance: 9251\n' +
        'Overpaid amount: 0\n' +
        'Healthy Path Status: 250 below healthy path\n';
        expect(sayText).toHaveBeenCalledWith(message);
        expect(project.sendMessage).toHaveBeenCalledWith({
            content: message,
            to_number: '0787654565'
        });
    });

    it('should show the popup and send the message of the balance with a non zero overpaid if payment is over the credit', () => {
        var clientMock2 = clientMock;
        clientMock2.BalanceHistory[0].TotalRepayment_IncludingOverpayments = 12000;
        contact.phone_number = '0787654565';
        getHealthyPathMessage.mockReturnValueOnce('Healthy Path Status: 250 below healthy path\n');
        checkBalance('en_bu', clientMock2);
        var message = 'Hello Tyrion Lanyster\n' +
        'Credit: 11011\n' +
        'Paid: 12000\n' +
        'Balance: 9251\n' +
        'Overpaid amount: 989\n' +
        'Healthy Path Status: 250 below healthy path\n';
        expect(sayText).toHaveBeenCalledWith(message);
        expect(project.sendMessage).toHaveBeenCalledWith({
            content: message,
            to_number: '0787654565'
        });
    });
});