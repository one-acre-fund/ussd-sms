
var clientMock1 = {
    LastName: 'Jeofrey',
    CountryId: 789,
    DistrictId: 456,
    BalanceHistory: [{
        TotalRepayment_IncludingOverpayments: 150,
        SeasonName: '2019',
        SeasonId: 123,
        TotalCredit: 500
    }]
};

var clientMock2 = {
    LastName: 'Jeofrey',
    BalanceHistory: []
};
describe('Rwandan repayments', () => {
    beforeAll(() => {
        contact.phone_number = '0788445637';
    });

    beforeEach(() => {
        contact.vars = {};
        jest.resetModules();
    });

    it('should send the repayment message once the repaid is zero', () => {
        const getHealthyPathPercentage = require('../healthy-path/utils/getHealthyPathPercentage');
        jest.mock('../healthy-path/utils/getHealthyPathPercentage');
        getHealthyPathPercentage.mockReturnValueOnce(0.9);
        contact.vars = {
            client: JSON.stringify(clientMock1),
            lastTransactionAmount: 250,
            lastTransactionId: '123',
            accountnumber: '12345678'
        };
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: '123'});
        require('./repaymentsRw');
        expect(project.getOrCreateLabel).toHaveBeenCalledWith('MM receipt');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Jeofrey\n' +
        'Mwishyuye 250 RWF\n' +
        'No y\'igikorwa: 123\n' +
        'No ya konti: 12345678\n' +
        'ayishyuwe yose 19A+B: 150 RWF\n' +
        'Kanda *801*0# for more information\n' + 
        'Ishyura 300 ugume murongo mwiza w\'ubwishyu\n' , 'label_ids': ['123'], 'to_number': '0788445637'});
    });

    it('should send the repayment message once there are seasons with balance', () => {
        contact.vars = {
            client: JSON.stringify(clientMock2),
            lastTransactionAmount: 320,
            lastTransactionId: '456',
            accountnumber: '87654321'
        };
        jest.spyOn(project, 'getOrCreateLabel').mockReturnValueOnce({id: '123'});
        require('./repaymentsRw');
        expect(project.sendMessage).toHaveBeenCalledWith({'content': 'Jeofrey\n' +
        'Mwishyuye 320 RWF\n' +
        'No y\'igikorwa: 456\n' +
        'No ya konti: 87654321\n' +
        'Kanda *801*0# for more information', 'label_ids': ['123'], 'to_number': '0788445637'});
    });

});