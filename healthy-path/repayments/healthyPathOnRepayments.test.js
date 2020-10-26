const HealthyPathMessage = require('./HealthyPathOnRepaymentReceipts');
var getHealthyPathPercentage = require('../utils/getHealthyPathPercentage');
jest.mock('../utils/getHealthyPathPercentage');

describe('Healthy path on Repayments receipt', () => {
    beforeAll(() => {
        getHealthyPathPercentage.mockReturnValue(0.3);
    });

    it('should return a message when the user is below the healthy path', () => {
        var message = HealthyPathMessage(1, 2, 3, 150, 24, 'en');
        expect(message).toBe('Pay 21 to stay on the healthy path\n');
    });
    it('should return an empty message when the user is above the healthy path', () => {
        var message = HealthyPathMessage(1, 2, 3, 150, 50, 'en');
        expect(message).toBe('');
    });
});