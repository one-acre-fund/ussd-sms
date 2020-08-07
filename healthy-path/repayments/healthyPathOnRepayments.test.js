const HealthyPathMessage = require('./HealthyPathOnRepaymentReceipts');
jest.mock('../utils/fetchHealthyPathData');
require('../utils/fetchHealthyPathData').mockImplementation(() => 0.3);

describe('Healthy path on Repayments receipt', () => {
    it('should return a message when the user is below the healthy path', () => {
        var message = HealthyPathMessage(150, 24, 'en');
        expect(message).toBe('Pay 21 to stay on the healthy path\n');
    });
    it('should return an empty message when the user is above the healthy path', () => {
        var message = HealthyPathMessage(150, 50, 'en');
        expect(message).toBe('');
    });
});