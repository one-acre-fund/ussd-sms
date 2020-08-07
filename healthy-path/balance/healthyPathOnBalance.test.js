const HealthyPathMessage = require('./healthyPathOnBalance');
jest.mock('../utils/fetchHealthyPathData');
require('../utils/fetchHealthyPathData').mockImplementation(() => 0.3);

describe('Healthy path on Balance screen', () => {
    it('should return a message when the user is below the healthy path', () => {
        var message = HealthyPathMessage(150, 24, 'en');
        expect(message).toBe('Healthy Path Status: 21 below healthy path\n');
    });
    it('should return a message when the user is above the healthy path', () => {
        var message = HealthyPathMessage(150, 50, 'en');
        expect(message).toBe('Healthy Path Status: 5 above healthy path\n');
    });
});